import { useEffect } from 'react';
import { useMapEvents } from 'react-leaflet';
import type L from 'leaflet';

interface MapEventHandlerProps {
    onBoundsChange: (bounds: L.LatLngBounds) => void;
    onMapReady: (map: L.Map) => void;
    onContextMenu: (e: L.LeafletMouseEvent) => void;
}

export function MapEventHandler({ onBoundsChange, onMapReady, onContextMenu }: MapEventHandlerProps) {
    const map = useMapEvents({
        moveend: () => {
            onBoundsChange(map.getBounds());
        },
        zoomend: () => {
            onBoundsChange(map.getBounds());
        },
        contextmenu: onContextMenu,
    });

    // Call onMapReady on initial render
    useEffect(() => {
        onMapReady(map);
    }, [map, onMapReady]);

    return null;
}


