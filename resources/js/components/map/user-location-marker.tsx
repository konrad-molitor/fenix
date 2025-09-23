import { Marker, Popup } from 'react-leaflet';
import { useTranslation } from '@/hooks/use-translation';

interface Position {
    lat: number;
    lng: number;
}

interface UserLocationMarkerProps {
    position: Position;
}

export function UserLocationMarker({ position }: UserLocationMarkerProps) {
    const { t } = useTranslation();
    return (
        <Marker position={[position.lat, position.lng]}>
            <Popup>
                {t('map.your_location', 'Your location')}
            </Popup>
        </Marker>
    );
}


