import { useEffect, useRef } from 'react';
import { useMap } from '@vis.gl/react-google-maps';

export default function CustomPolyline({
    path,
    options,
}: {
    path: google.maps.LatLngLiteral[];
    options: google.maps.PolylineOptions;
}) {
    const map = useMap();
    const polylineRef = useRef<google.maps.Polyline | null>(null);

    useEffect(() => {
        if (!map) return;

        // Remove previous polyline
        if (polylineRef.current) {
            polylineRef.current.setMap(null);
        }

        polylineRef.current = new google.maps.Polyline({
            path,
            map,
            ...options,
        });

        return () => {
            polylineRef.current?.setMap(null);
        };
    }, [map, path, options]);

    return null;
}