import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { useNotification } from '@/hooks/use-notification';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ImageViewer } from '@/components/map/image-viewer';
import axios from 'axios';

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
    distance: number; // Distance in meters
}

const USER_LOCATION_KEY = 'fenix_user_location';

export default function DashboardList() {
    const { t } = useTranslation();
    const { error, success } = useNotification();
    const [position, setPosition] = useState<Position | null>(null);
    const [loading, setLoading] = useState(true);
    const [points, setPoints] = useState<Point[]>([]);
    const [loadingMore, setLoadingMore] = useState(false);
    const [radius, setRadius] = useState(1000); // Start with 1km
    const [hasMore, setHasMore] = useState(true);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [locationError, setLocationError] = useState(false);

    // Get user location on mount
    useEffect(() => {
        const defaultPosition = { lat: -34.9039117264286, lng: -56.192105244471165 };
        
        // Try to load saved user location
        try {
            const savedLocation = localStorage.getItem(USER_LOCATION_KEY);
            if (savedLocation) {
                const parsed = JSON.parse(savedLocation);
                if (parsed && typeof parsed.lat === 'number' && typeof parsed.lng === 'number') {
                    setPosition(parsed);
                    setLoading(false);
                    return;
                }
            }
        } catch (err) {
            console.warn('Failed to load saved location:', err);
        }
        
        // Try to get current location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const newPosition = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    setPosition(newPosition);
                    
                    try {
                        localStorage.setItem(USER_LOCATION_KEY, JSON.stringify(newPosition));
                    } catch (err) {
                        console.warn('Failed to save location:', err);
                    }
                    
                    setLoading(false);
                },
                (err) => {
                    console.warn('Geolocation error:', err);
                    setPosition(defaultPosition);
                    setLocationError(true);
                    setLoading(false);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0,
                }
            );
        } else {
            setPosition(defaultPosition);
            setLocationError(true);
            setLoading(false);
        }
    }, []);

    // Load initial points
    useEffect(() => {
        if (position) {
            loadPoints();
        }
    }, [position]);

    const loadPoints = async () => {
        if (!position) return;

        try {
            setLoading(true);
            const response = await axios.get('/api/points/list-view', {
                params: {
                    latitude: position.lat,
                    longitude: position.lng,
                    radius: radius,
                }
            });
            
            setPoints(response.data.points);
            setHasMore(response.data.count > 0 && radius < 4000);
        } catch (err) {
            console.error('Error loading points:', err);
            error(t('list.error_loading_points', 'Error loading points'), t('list.error', 'Error'));
        } finally {
            setLoading(false);
        }
    };

    const loadMore = async () => {
        if (!position || loadingMore || !hasMore) return;

        try {
            setLoadingMore(true);
            const newRadius = Math.min(radius + 500, 4000);
            
            const response = await axios.get('/api/points/list-view', {
                params: {
                    latitude: position.lat,
                    longitude: position.lng,
                    radius: newRadius,
                    exclude_ids: points.map(p => p.id),
                }
            });
            
            const newPoints = response.data.points;
            
            // If no new points found and we haven't reached max radius, try again with larger radius
            if (newPoints.length === 0 && newRadius < 4000) {
                const evenLargerRadius = Math.min(newRadius + 500, 4000);
                
                const secondResponse = await axios.get('/api/points/list-view', {
                    params: {
                        latitude: position.lat,
                        longitude: position.lng,
                        radius: evenLargerRadius,
                        exclude_ids: points.map(p => p.id),
                    }
                });
                
                setPoints(prev => [...prev, ...secondResponse.data.points]);
                setRadius(evenLargerRadius);
                setHasMore(secondResponse.data.points.length > 0 && evenLargerRadius < 4000);
            } else {
                setPoints(prev => [...prev, ...newPoints]);
                setRadius(newRadius);
                setHasMore(newPoints.length > 0 && newRadius < 4000);
            }
        } catch (err) {
            console.error('Error loading more points:', err);
            error(t('list.error_loading_more', 'Error loading more points'), t('list.error', 'Error'));
        } finally {
            setLoadingMore(false);
        }
    };

    const formatDistance = (meters: number): string => {
        if (meters < 1000) {
            return `${Math.round(meters)} ${t('list.meters', 'm')}`;
        }
        return `${(meters / 1000).toFixed(1)} ${t('list.kilometers', 'km')}`;
    };

    const getTypeLabel = (type: string): string => {
        switch (type) {
            case 'incident':
                return t('list.type_incident', 'Incident');
            case 'crime':
                return t('list.type_crime', 'Crime');
            case 'event':
                return t('list.type_event', 'Event');
            default:
                return type;
        }
    };

    const getTypeColor = (type: string): string => {
        switch (type) {
            case 'incident':
                return 'bg-yellow-100 text-yellow-800';
            case 'crime':
                return 'bg-red-100 text-red-800';
            case 'event':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

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

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);

        if (diffHours < 1) {
            return t('list.just_now', 'Just now');
        } else if (diffHours < 24) {
            return t('list.hours_ago', `{{count}}h ago`, { count: String(diffHours) });
        } else if (diffDays < 7) {
            return t('list.days_ago', `{{count}}d ago`, { count: String(diffDays) });
        } else {
            return date.toLocaleDateString();
        }
    };

    if (loading) {
        return (
            <div className="flex h-full w-full flex-col items-center justify-center gap-4 overflow-auto p-4">
                <Spinner size="3" />
                <p className="text-sm text-muted-foreground">
                    {t('list.loading', 'Loading points...')}
                </p>
            </div>
        );
    }

    return (
        <div className="h-full w-full overflow-auto p-4">
            <div className="max-w-3xl mx-auto space-y-4">
                {/* Header */}
                <div className="bg-card rounded-lg border p-4 shadow-sm">
                    <h2 className="text-xl font-semibold mb-2">
                        {t('list.nearby_points', 'Nearby Points')}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        {locationError 
                            ? t('list.using_default_location', 'Using default location')
                            : t('list.showing_within', `Showing points within ${formatDistance(radius)}`)}
                    </p>
                    {points.length > 0 && (
                        <p className="text-sm text-muted-foreground mt-1">
                            {t('list.found_points', `Found {{count}} point(s)`, { count: String(points.length) })}
                        </p>
                    )}
                </div>

                {/* Points list */}
                {points.length === 0 ? (
                    <div className="bg-card rounded-lg border p-8 text-center">
                        <p className="text-muted-foreground">
                            {t('list.no_points_found', 'No points found nearby')}
                        </p>
                        {hasMore && (
                            <Button 
                                onClick={loadMore} 
                                className="mt-4"
                                disabled={loadingMore}
                            >
                                {loadingMore ? (
                                    <>
                                        <Spinner size="1" className="mr-2" />
                                        {t('list.searching', 'Searching...')}
                                    </>
                                ) : (
                                    t('list.search_wider', 'Search wider area')
                                )}
                            </Button>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="space-y-3">
                            {points.map((point) => (
                                <Card key={point.id} className="p-4 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                <h3 className="font-semibold text-lg truncate">
                                                    {point.title || t('list.untitled_point', 'Untitled Point')}
                                                </h3>
                                                <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${getTypeColor(point.type)}`}>
                                                    {getTypeLabel(point.type)}
                                                </span>
                                            </div>
                                            
                                            {point.address && (
                                                <p className="text-sm text-muted-foreground mb-1 line-clamp-1">
                                                    📍 {point.address}
                                                </p>
                                            )}
                                            
                                            {point.description && (
                                                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                                    {point.description}
                                                </p>
                                            )}
                                            
                                            {/* Images */}
                                            {point.images && point.images.length > 0 && (
                                                <div className="flex gap-2 mb-3 overflow-x-auto">
                                                    {point.images.map((image) => (
                                                        <img
                                                            key={image.id}
                                                            src={image.url}
                                                            alt="Point image"
                                                            className="h-20 w-auto object-cover rounded cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0"
                                                            onClick={() => setSelectedImage(image.url)}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                            
                                            <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                                                <span>
                                                    {t('list.by', 'by')} <span className="font-medium">{point.user.name}</span>
                                                </span>
                                                <span>{formatDate(point.created_at)}</span>
                                            </div>
                                            
                                            {point.is_own && (
                                                <button 
                                                    onClick={() => deletePoint(point.id)}
                                                    className="mt-2 px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
                                                >
                                                    {t('map.delete', 'Delete')}
                                                </button>
                                            )}
                                        </div>
                                        
                                        <div className="text-right flex-shrink-0">
                                            <div className="text-sm font-medium text-primary">
                                                {formatDistance(point.distance)}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {/* Load More Button */}
                        {hasMore && (
                            <div className="flex justify-center pt-4">
                                <Button 
                                    onClick={loadMore} 
                                    disabled={loadingMore}
                                    variant="outline"
                                    size="lg"
                                >
                                    {loadingMore ? (
                                        <>
                                            <Spinner size="1" className="mr-2" />
                                            {t('list.loading_more', 'Loading more...')}
                                        </>
                                    ) : (
                                        t('list.load_more', 'Load More')
                                    )}
                                </Button>
                            </div>
                        )}

                        {!hasMore && radius >= 4000 && (
                            <div className="text-center py-4 text-sm text-muted-foreground">
                                {t('list.reached_max_distance', 'Reached maximum search distance (4km)')}
                            </div>
                        )}
                    </>
                )}
            </div>

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
