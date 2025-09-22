import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useTranslation } from '@/hooks/use-translation';
import { useNotification } from '@/hooks/use-notification';
import { Spinner } from '@/components/ui/spinner';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

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

export default function DashboardMap() {
    const { t } = useTranslation();
    const { error } = useNotification();
    const [position, setPosition] = useState<Position | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!navigator.geolocation) {
            error(
                t('map.geolocation_not_supported', 'Geolocation is not supported by your browser'),
                t('map.location_error', 'Geolocation error')
            );
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setPosition({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
                setLoading(false);
            },
            (err) => {
                console.error('Geolocation error:', err);
                error(
                    t('map.location_required', 'Location access is required for the service to work'),
                    t('map.location_error', 'Geolocation error')
                );
                setLoading(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000,
            }
        );
    }, [error, t]);

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
        <div className="h-full w-full overflow-hidden p-1">
            <MapContainer
                center={[position.lat, position.lng]}
                zoom={15}
                className="h-full w-full"
                zoomControl={true}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    className="map-tiles"
                />
                <Marker position={[position.lat, position.lng]}>
                    <Popup>
                        {t('map.your_location', 'Your location')}
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}
