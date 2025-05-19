import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MapTest: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="h-96 w-full max-w-2xl border border-cyan-400 rounded overflow-hidden">
        <MapContainer
          center={[50.0755, 14.4378]} // Prague
          zoom={13}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://osm.org">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[50.0755, 14.4378]}>
            <Popup>
              Prague center!
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default MapTest;
