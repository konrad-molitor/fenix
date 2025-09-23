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
    is_own: boolean;
    created_at: string;
}

// Map events are handled by extracted component

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
    const createPoint = async (lat: number, lng: number, title: string, type: string, description?: string, address?: string) => {
        try {
            const response = await axios.post('/api/points', {
                latitude: lat,
                longitude: lng,
                title: title,
                description: description || '',
                type: type,
                address: address || '',
            });
            
            setPoints(prev => [...prev, response.data]);
            success(t('map.point_created', 'Point created successfully'), t('map.success', 'Success'));
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

    // Get user location (only once when component mounts)
    useEffect(() => {
        // Set default position (Moscow as fallback)
        const defaultPosition = { lat: 55.7558, lng: 37.6176 };
        
        if (!navigator.geolocation) {
            setPosition(defaultPosition);
            setLoading(false);
            return;
        }

        // Try to get geolocation with a more reasonable timeout
        const timeoutId = setTimeout(() => {
            // If geolocation takes too long, use default position
            setPosition(defaultPosition);
            setLoading(false);
        }, 5000);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                clearTimeout(timeoutId);
                setPosition({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
                setLoading(false);
            },
            (err) => {
                clearTimeout(timeoutId);
                console.warn('Geolocation error:', err);
                // Use default position instead of showing error
                setPosition(defaultPosition);
                setLoading(false);
            },
            {
                enableHighAccuracy: false, // Less aggressive
                timeout: 5000,
                maximumAge: 300000, // 5 minutes
            }
        );

        return () => clearTimeout(timeoutId);
    }, []); // Remove dependencies to prevent re-triggering

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
                            data.description
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
        </div>
    );
}