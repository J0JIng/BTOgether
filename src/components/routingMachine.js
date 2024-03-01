import L from "leaflet";
import "leaflet-routing-machine";
import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';

L.Marker.prototype.options.icon = L.icon({
    iconUrl: require("../icons/google-maps.png"), iconSize: [0, 0]
});

const RoutingMachine = ({ markerLat, markerLng }) => {
    const map = useMap();
    const routingControlRef = useRef(null);

    useEffect(() => {
        // Check if markerLat and markerLng are not null and not equal to 0
        if (markerLat && markerLng && markerLat !== 0 && markerLng !== 0) {
            if (routingControlRef.current) {
                // Reset waypoints of existing routing control
                routingControlRef.current.setWaypoints([
                    L.latLng(1.3455586, 103.6817077),
                    L.latLng(markerLat, markerLng)
                ]);
            } else {
                const routingControl = L.Routing.control({
                    waypoints: [
                        L.latLng(1.3455586,103.6817077),
                        L.latLng(markerLat, markerLng)
                    ],
                    lineOptions: {
                        styles: [{ color: "#1893ff", weight: 4 }]
                    },
                    show: false, // Hide routing control's UI
                    addWaypoints: false,
                    routeWhileDragging: true,
                    draggableWaypoints: true,
                    fitSelectedRoutes: true,
                    showAlternatives: false
                });

                routingControl.addTo(map);
                routingControlRef.current = routingControl;
            }
            const element = document.querySelector('.leaflet-routing-container');
            if (element) {
                element.style.display = 'block'; // Show the div
                element.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
                element.style.maxHeight = '200px'; // Set max height
                element.style.overflowY = 'auto'; // Enable scrolling if content exceeds max height
            }
        } else {
            const element = document.querySelector('.leaflet-routing-container');
            if (element) {
                element.style.display = 'none'; // Hide the div
            }
            // Reset routing control reference if lat/lng is null or 0
            routingControlRef.current = null;
        }
    }, [map, markerLat, markerLng]);

    return null;
};

export default RoutingMachine;
