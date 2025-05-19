import React, { useEffect, useState } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LatLngBounds } from "leaflet";
import type { RefuelLog } from "../../types/RefuelLog";

// Vite-compatible marker icon imports
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix marker icons
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

// Auto-zoom effect based on visible logs
const MapEffect: React.FC<{ logs: RefuelLog[] }> = ({ logs }) => {
    const map = useMap();

    useEffect(() => {
        if (logs.length) {
            const bounds = new LatLngBounds(
                logs.map((log) => [log.lat!, log.lon!] as [number, number])
            );
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [logs, map]);

    return null;
};

const LogMap: React.FC = () => {
    const [logs, setLogs] = useState<RefuelLog[]>([]);
    const [hasMounted, setHasMounted] = useState(false);

    const customIcon = new L.Icon({
        iconUrl: markerIcon,
        iconRetinaUrl: markerIcon2x,
        shadowUrl: markerShadow,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });

    useEffect(() => {
        setHasMounted(true);

        const stored = localStorage.getItem("mapLogs");
        if (stored) {
            const parsed: RefuelLog[] = JSON.parse(stored);
            const validLogs = parsed.filter((log) => log.lat && log.lon);
            setLogs(validLogs);
        }
        console.log(markerIcon)
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-black text-white">
            <div className="flex-grow">
                {hasMounted && (
                    <MapContainer
                        center={[50.0755, 14.4378]} // fallback center (Prague)
                        zoom={6}
                        scrollWheelZoom={true}
                        className="absolute inset-0 z-0"
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <MapEffect logs={logs} />
                        {logs.map((log) => (
                            <Marker key={log.id} position={[log.lat!, log.lon!]} icon={customIcon}>
                                <Popup>
                                    <div>
                                        <strong>Date:</strong> {log.date} <br />
                                        <strong>Mileage:</strong> {log.mileage} km <br />
                                        <strong>Liters:</strong> {log.liters} <br />
                                        <strong>Price:</strong> {log.price} CZK
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                )}
            </div>
        </div>
    );
};

export default LogMap;
