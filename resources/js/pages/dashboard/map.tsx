import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useTranslation } from '@/hooks/use-translation';
import { useNotification } from '@/hooks/use-notification';
import { Spinner } from '@/components/ui/spinner';
import { AddPointDialog } from '@/components/map/add-point-dialog';
import { DeletePointDialog } from '@/components/map/delete-point-dialog';
import { MapContextMenu } from '@/components/map/map-context-menu';
import { MapEventHandler } from '@/components/map/map-event-handler';
import { UserLocationMarker } from '@/components/map/user-location-marker';
import { PointsLoadingIndicator } from '@/components/map/points-loading-indicator';
import { ImageViewer } from '@/components/map/image-viewer';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';

// Fix Leaflet marker icons
delete (L.Icon.Default.prototype as unknown as { _getIconUrl: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface Position {
    lat: number;
    lng: number;
}

interface Point {
    id: number;
    title: string | null;
    description: string | null;
    address?: string | null;
    type: string;
    latitude: number;
    longitude: number;
    user: {
        id: number;
        name: string;
    };
    images?: Array<{
        id: number;
        url: string;
    }>;
    is_own: boolean;
    created_at: string;
}

// Map events are handled by extracted component

const USER_LOCATION_KEY = 'fenix_user_location';

export default function DashboardMap() {
    const { t } = useTranslation();
    const { error, success } = useNotification();
    const [position, setPosition] = useState<Position | null>(null);
    const [loading, setLoading] = useState(true);
    const [points, setPoints] = useState<Point[]>([]);
    const [pointsLoading, setPointsLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [clickedPosition, setClickedPosition] = useState<Position | null>(null);
    const [selectedPoint, setSelectedPoint] = useState<Point | null>(null);
    const [mapInitialized, setMapInitialized] = useState(false);
    const [contextMenu, setContextMenu] = useState<{ show: boolean; position: { x: number; y: number }; coords: Position | null }>({
        show: false,
        position: { x: 0, y: 0 },
        coords: null
    });
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const mapRef = useRef<L.Map | null>(null);
    const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);

    // Load points within bounds with debouncing
    const loadPoints = async (bounds: L.LatLngBounds) => {
        // Clear previous timeout
        if (loadingTimeoutRef.current) {
            clearTimeout(loadingTimeoutRef.current);
        }

        // Debounce the request
        loadingTimeoutRef.current = setTimeout(async () => {
            try {
                setPointsLoading(true);
                const sw = bounds.getSouthWest();
                const ne = bounds.getNorthEast();
                
                const response = await axios.get('/api/points', {
                    params: {
                        sw_lat: sw.lat,
                        sw_lng: sw.lng,
                        ne_lat: ne.lat,
                        ne_lng: ne.lng,
                    }
                });
                
                console.log('📍 Loaded points with images:', response.data);
                setPoints(response.data);
            } catch (err) {
                console.error('Error loading points:', err);
                error(t('map.error_loading_points', 'Error loading points'), t('map.error', 'Error'));
            } finally {
                setPointsLoading(false);
            }
        }, 300); // 300ms debounce
    };

    // Create new point
    const createPoint = async (lat: number, lng: number, title: string, type: string, description?: string, address?: string, images?: File[]) => {
        try {
            const response = await axios.post('/api/points', {
                latitude: lat,
                longitude: lng,
                title: title,
                description: description || '',
                type: type,
                address: address || '',
            });
            
            const newPoint = response.data;
            
            // Upload images if any
            if (images && images.length > 0) {
                console.log('📤 Uploading', images.length, 'images for point', newPoint.id);
                try {
                    const uploadResults = await Promise.all(
                        images.map(async (image, index) => {
                            console.log(`📤 Uploading image ${index + 1}/${images.length}:`, image.name, image.size);
                            const formData = new FormData();
                            formData.append('image', image);
                            
                            const result = await axios.post(`/api/points/${newPoint.id}/images`, formData, {
                                headers: {
                                    'Content-Type': 'multipart/form-data',
                                },
                            });
                            console.log(`✅ Image ${index + 1} uploaded:`, result.data);
                            return result.data.data;
                        })
                    );
                    
                    // Update point with uploaded images
                    newPoint.images = uploadResults;
                    console.log('✅ All images uploaded, point updated:', newPoint);
                    success(t('map.point_created_with_images', 'Point and images created successfully'), t('map.success', 'Success'));
                } catch (imgErr) {
                    console.error('❌ Error uploading images:', imgErr);
                    
                    // Point created but images failed
                    success(t('map.point_created', 'Point created successfully'), t('map.success', 'Success'));
                    
                    // Show specific error message
                    const axiosError = imgErr as { response?: { data?: { message?: string; errors?: { image?: string[] } } } };
                    const errorMessage = axiosError.response?.data?.message 
                        || axiosError.response?.data?.errors?.image?.[0] 
                        || t('map.error_uploading_images', 'Some images failed to upload');
                    
                    error(errorMessage, t('map.error', 'Error'));
                }
            } else {
                success(t('map.point_created', 'Point created successfully'), t('map.success', 'Success'));
            }
            
            setPoints(prev => [...prev, newPoint]);
        } catch (err) {
            console.error('Error creating point:', err);
            error(t('map.error_creating_point', 'Error creating point'), t('map.error', 'Error'));
        }
    };

    // Delete point
    const deletePoint = async (pointId: number) => {
        try {
            await axios.delete(`/api/points/${pointId}`);
            setPoints(prev => prev.filter(p => p.id !== pointId));
            success(t('map.point_deleted', 'Point deleted successfully'), t('map.success', 'Success'));
        } catch (err) {
            console.error('Error deleting point:', err);
            error(t('map.error_deleting_point', 'Error deleting point'), t('map.error', 'Error'));
        }
    };

    // Handle point deletion
    const handleDeletePoint = (point: Point) => {
        setSelectedPoint(point);
        setDeleteDialogOpen(true);
    };

    // Handle context menu click
    const handleContextMenuClick = (lat: number, lng: number) => {
        setClickedPosition({ lat, lng });
        setDialogOpen(true);
    };

    const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
        try {
            const contact = import.meta.env.VITE_NOMINATIM_CONTACT || 'contact@fenix.local';
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}` , {
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': `fenix-app/1.0 (contact: ${contact})`
                }
            });
            if (!res.ok) throw new Error('Failed');
            const data = await res.json();
            return data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        } catch {
            return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        }
    };

    // Handle context menu for map
    const handleMapContextMenu = (e: L.LeafletMouseEvent) => {
        // Always prevent the native context menu
        e.originalEvent?.preventDefault();
        e.originalEvent?.stopPropagation();

        // Use viewport coordinates for a fixed-position menu
        const originalEvent = e.originalEvent as MouseEvent | undefined;
        const x = originalEvent?.clientX ?? e.containerPoint.x;
        const y = originalEvent?.clientY ?? e.containerPoint.y;

        // Clear any previously selected point when opening menu on map
        setSelectedPoint(null);

        setContextMenu({
            show: true,
            position: { x, y },
            coords: { lat: e.latlng.lat, lng: e.latlng.lng }
        });
    };

    // Handle bounds change
    const handleBoundsChange = (bounds: L.LatLngBounds) => {
        loadPoints(bounds);
    };

    // Handle map ready (initial load)
    const handleMapReady = (map: L.Map) => {
        // Load points once on initial map render
        if (!mapInitialized) {
            setMapInitialized(true);
            loadPoints(map.getBounds());
        }
    };

    // Set position on mount (from localStorage or default)
    useEffect(() => {
        const defaultPosition = { lat: -34.9039117264286, lng: -56.192105244471165 };
        
        // Try to load saved user location
        try {
            const savedLocation = localStorage.getItem(USER_LOCATION_KEY);
            if (savedLocation) {
                const parsed = JSON.parse(savedLocation);
                // Validate that it has lat and lng
                if (parsed && typeof parsed.lat === 'number' && typeof parsed.lng === 'number') {
                    setPosition(parsed);
                    setLoading(false);
                    return;
                }
            }
        } catch (err) {
            console.warn('Failed to load saved location:', err);
        }
        
        // Fall back to default position
        setPosition(defaultPosition);
        setLoading(false);
    }, []);

    // Get user location (triggered by user gesture)
    const getUserLocation = () => {
        if (!navigator.geolocation) {
            error(t('map.geolocation_not_supported', 'Geolocation is not supported by your browser'), t('map.error', 'Error'));
            return;
        }

        const timeoutId = setTimeout(() => {
            error(t('map.geolocation_timeout', 'Geolocation request timed out'), t('map.error', 'Error'));
        }, 5000);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                clearTimeout(timeoutId);
                const newPosition = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                setPosition(newPosition);
                
                // Save user location to localStorage
                try {
                    localStorage.setItem(USER_LOCATION_KEY, JSON.stringify(newPosition));
                } catch (err) {
                    console.warn('Failed to save location:', err);
                }
                
                // Center map on user location
                if (mapRef.current) {
                    mapRef.current.setView([newPosition.lat, newPosition.lng], 15);
                }
                
                success(t('map.location_found', 'Location found'), t('map.success', 'Success'));
            },
            (err) => {
                clearTimeout(timeoutId);
                console.warn('Geolocation error:', err);
                error(t('map.geolocation_error', 'Unable to get your location'), t('map.error', 'Error'));
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0,
            }
        );
    };

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (loadingTimeoutRef.current) {
                clearTimeout(loadingTimeoutRef.current);
            }
        };
    }, []);

    // After window refocus, ensure map dragging is enabled and intercept context menus
    useEffect(() => {
        const onFocus = () => {
            const map = mapRef.current;
            if (map) {
                map.dragging.enable();
                map.boxZoom.enable();
                map.keyboard.enable();
            }
        };

        window.addEventListener('focus', onFocus);
        return () => {
            window.removeEventListener('focus', onFocus);
        };
    }, []);

    if (loading) {
        return (
            <div className="flex h-full w-full flex-col items-center justify-center gap-4 overflow-auto p-4">
                <Spinner size="3" />
                <p className="text-sm text-muted-foreground">
                    {t('map.loading', 'Loading map...')}
                </p>
            </div>
        );
    }

    if (!position) {
        return (
            <div className="flex h-full w-full flex-col items-center justify-center gap-4 overflow-auto p-4">
                <p className="text-center text-muted-foreground">
                    {t('map.no_location', 'Unable to get location')}
                </p>
            </div>
        );
    }

        return (
            <div
                className="h-full w-full overflow-hidden p-1"
                ref={mapContainerRef}
                onContextMenu={(e) => {
                    // Prevent native context menu anywhere over the map area
                    e.preventDefault();
                }}
            >
            <MapContainer
                center={[position.lat, position.lng]}
                zoom={15}
                className="h-full w-full"
                zoomControl={true}
                ref={mapRef}
            >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            className="map-tiles"
                        />
                        
                        <MapEventHandler 
                            onBoundsChange={handleBoundsChange}
                            onMapReady={handleMapReady}
                            onContextMenu={handleMapContextMenu}
                        />
                
                {/* User location marker */}
                <UserLocationMarker position={position} />
                
                {/* Points markers */}
                {points.map((point) => (
                    <Marker 
                        key={point.id}
                        position={[point.latitude, point.longitude]}
                        eventHandlers={point.is_own ? {
                            contextmenu: (e) => {
                                // Prevent native context menu and open our menu at cursor position
                                e.originalEvent?.preventDefault();
                                e.originalEvent?.stopPropagation();

                                const oe = e.originalEvent as MouseEvent | undefined;
                                const x = oe?.clientX ?? e.containerPoint.x;
                                const y = oe?.clientY ?? e.containerPoint.y;

                                setSelectedPoint(point);
                                setContextMenu({
                                    show: true,
                                    position: { x, y },
                                    coords: { lat: point.latitude, lng: point.longitude }
                                });
                            }
                        } : {
                            contextmenu: (e) => {
                                // For others' points, just stop propagation
                                e.originalEvent?.preventDefault();
                                e.originalEvent?.stopPropagation();
                            }
                        }}
                    >
                        <Popup>
                            <div className="min-w-48">
                                <h3 className="font-semibold text-sm">
                                    {point.title || t('map.untitled_point', 'Untitled Point')}
                                </h3>
                                {point.address && (
                                    <p className="text-xs text-gray-600 mt-1">
                                        {point.address}
                                    </p>
                                )}
                                {!point.address && point.description && (
                                    <p className="text-xs text-gray-600 mt-1">
                                        {point.description}
                                    </p>
                                )}
                                
                                {/* Images */}
                                {point.images && point.images.length > 0 && (
                                    <div className="flex gap-1 mt-2 overflow-x-auto">
                                        {point.images.map((image) => (
                                            <img
                                                key={image.id}
                                                src={image.url}
                                                alt="Point image"
                                                className="h-16 w-auto object-cover rounded cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0"
                                                style={{ maxWidth: '20vw' }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedImage(image.url);
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}
                                
                                <p className="text-xs text-gray-500 mt-2">
                                    {t('map.created_by', 'Created by')}: {point.user.name}
                                </p>
                                {point.is_own && (
                                    <button 
                                        onClick={() => {
                                            handleDeletePoint(point);
                                            const map = mapRef.current;
                                            if (map) {
                                                // Close any open Leaflet popups when triggering delete
                                                map.closePopup();
                                            }
                                        }}
                                        className="mt-2 px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                                    >
                                        {t('map.delete', 'Delete')}
                                    </button>
                                )}
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
            
            {/* My Location Button */}
            <button
                onClick={getUserLocation}
                className="absolute bottom-28 right-4 z-[1000] flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors"
                title={t('map.my_location', 'My location')}
                aria-label={t('map.my_location', 'My location')}
            >
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    strokeWidth={2} 
                    stroke="currentColor" 
                    className="h-6 w-6 text-gray-700"
                >
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" 
                    />
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" 
                    />
                </svg>
            </button>
            
            <PointsLoadingIndicator show={pointsLoading} />
            
            <MapContextMenu
                show={contextMenu.show}
                position={contextMenu.position}
                onClose={() => setContextMenu({ show: false, position: { x: 0, y: 0 }, coords: null })}
                onAddPoint={() => {
                    if (contextMenu.coords) {
                        handleContextMenuClick(contextMenu.coords.lat, contextMenu.coords.lng);
                    }
                }}
                onDeletePoint={selectedPoint ? () => setDeleteDialogOpen(true) : undefined}
            />
            
            <AddPointDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                position={clickedPosition}
                onGetAddress={async (lat, lng) => reverseGeocode(lat, lng)}
                onSave={(data) => {
                    if (clickedPosition) {
                        createPoint(
                            clickedPosition.lat,
                            clickedPosition.lng,
                            data.title,
                            data.type,
                            '',
                            // store fetched address from dialog
                            data.description,
                            data.images
                        );
                    }
                    setDialogOpen(false);
                    setClickedPosition(null);
                }}
            />
            
            <DeletePointDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                point={selectedPoint}
                onConfirm={() => {
                    if (selectedPoint) {
                        deletePoint(selectedPoint.id);
                    }
                }}
            />
            
            {/* Image Viewer Overlay */}
            {selectedImage && (
                <ImageViewer
                    imageUrl={selectedImage}
                    onClose={() => setSelectedImage(null)}
                />
            )}
        </div>
    );
}