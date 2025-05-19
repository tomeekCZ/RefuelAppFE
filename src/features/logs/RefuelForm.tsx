import React, { useState, useEffect, useRef } from "react";
import type { RefuelLog } from "../../types/RefuelLog";
import type { Car } from "../../types/Car";
import { LogService } from "../../services/LogService";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { Calendar } from "lucide-react";
import { Map as LeafletMap } from "leaflet";
import NeonCard from "../../components/NeonCard";
import { useParams } from "react-router-dom";
import type { User } from "../../types/User";
import type { Currency } from "../../types/Currency";
import L from "leaflet";
import { fetchFromApi } from "../../services/api";
import { useNavigate } from "react-router-dom";

// Vite-compatible marker icon imports
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const RefuelForm: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cars, setCars] = useState<Car[]>([]);
  const [selectedCarId, setSelectedCarId] = useState<number | null>(null);
  const [selectedCurrencyId, setSelectedCurrencyId] = useState<number | undefined>(undefined);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [mileage, setMileage] = useState("");
  const [liters, setLiters] = useState("");
  const [price, setPrice] = useState("");
  const [stationBrand, setStationBrand] = useState("");
  const [comments, setComments] = useState("");
  const [lat, setLat] = useState<number | null>(null);
  const [lon, setLon] = useState<number | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const { id } = useParams<{ id: string }>();
  const [logs, setLogs] = useState<RefuelLog[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    LogService.getLogs()
      .then(setLogs)
      .catch((err) => console.error("Failed to load logs", err));
  }, []);

  useEffect(() => {
    fetchFromApi("currencies")
      .then((data) => setCurrencies(data))
      .catch(console.error);

    fetchFromApi("cars")
      .then((cars: Car[]) => {
        setCars(cars);
      })
      .catch(console.error);
  }, []);

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
    if (!id && (!lat || !lon)) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLat(pos.coords.latitude);
        setLon(pos.coords.longitude);
        mapRef.current?.setView([pos.coords.latitude, pos.coords.longitude], 13);
      });
    }
  }, [id, lat, lon]);

  useEffect(() => {
    const defaultUser: User = JSON.parse(localStorage.getItem("defaultUser") || "{}");
    setCurrentUser(defaultUser);
    setSelectedCarId(defaultUser.primaryCarId ?? null);
    setSelectedCurrencyId(defaultUser.preferredCurrencyId ?? null);
  }, []);

  useEffect(() => {
    if (id) {
      const log = logs.find((log) => log.id.toString() === id);
      if (log) {
        setSelectedCarId(log.carId);
        setSelectedCurrencyId(log.currencyId);
        setDate(log.date);
        setMileage(log.mileage.toString());
        setLiters(log.liters.toString());
        setPrice(log.price.toString());
        setStationBrand(log.stationBrand);
        setComments(log.comments || "");
        if (log.lat) setLat(log.lat);
        if (log.lon) setLon(log.lon);
      }
    }
  }, [id, logs]);

  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        setLat(e.latlng.lat);
        setLon(e.latlng.lng);
      },
    });
    return null;
  };

  const selectedCurrency = currencies.find((c) => c.currencyId === selectedCurrencyId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCarId || !currentUser) return;

    const updatedLog: RefuelLog = {
      id: id ? parseInt(id) : Date.now(),
      userId: currentUser.id,
      carId: selectedCarId,
      date,
      mileage: parseFloat(mileage),
      liters: parseFloat(liters),
      price: parseFloat(price),
      currencyId: selectedCurrencyId ?? 1,
      stationBrand,
      comments,
      lat: lat ?? undefined,
      lon: lon ?? undefined,
    };

    console.log(updatedLog)

    if (id) {
      LogService.updateLog(updatedLog);
      alert("Log updated!");
      navigate("/logs/history");
    } else {
      LogService.saveLog(updatedLog);
      alert("Log saved!");
    }
  };


  const isReady = currentUser && selectedCurrencyId !== undefined;

  if (!isReady) {
    return <div className="text-white p-4">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white flex justify-center items-start p-4">
      <NeonCard title="Log Refueling Form" className="w-full max-w-2xl">
        <h1 className="text-2xl text-cyan-400 font-bold mb-4">Log Refueling</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-cyan-400 text-sm mb-1 block">Select Car</label>
            <select
              value={selectedCarId?.toString() ?? ""}
              onChange={(e) => setSelectedCarId(parseInt(e.target.value))}
              className="w-full bg-gray-900 text-cyan-200 border border-cyan-400 rounded px-3 py-2"
            >
              <option value="" disabled>
                -- Choose a car --
              </option>
              {cars.map((car) => (
                <option key={car.id} value={car.id}>
                  {car.brand} {car.model}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <label className="text-cyan-400 text-sm mb-1 block">Date</label>
            <input
              ref={dateRef}
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-gray-900 text-cyan-200 border border-cyan-400 rounded px-3 py-2 pr-10 appearance-none"
            />
            <Calendar
              size={18}
              className="absolute right-3 bottom-2 text-cyan-400 cursor-pointer"
              onClick={() => dateRef.current?.showPicker?.()}
            />
          </div>

          <div>
            <label className="text-cyan-400 text-sm mb-1 block">Currency</label>
            <select
              value={selectedCurrencyId ?? ""}
              onChange={(e) => setSelectedCurrencyId(Number(e.target.value))}
              className="w-full bg-gray-900 text-cyan-200 border border-cyan-400 rounded px-3 py-2"
            >
              {currencies.map((currency) => (
                <option key={currency.currencyId} value={currency.currencyId}>
                  {currency.currencyCode} – {currency.currencyName}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              value={mileage}
              onChange={(e) => setMileage(e.target.value)}
              placeholder="Mileage (km)"
              className="bg-gray-900 text-cyan-200 border border-cyan-400 rounded px-3 py-2 w-full"
            />
            <input
              type="number"
              value={liters}
              onChange={(e) => setLiters(e.target.value)}
              placeholder="Liters"
              className="bg-gray-900 text-cyan-200 border border-cyan-400 rounded px-3 py-2 w-full"
            />
          </div>

          <div>
            <label className="text-cyan-400 text-sm mb-1 block">
              Price {selectedCurrency ? `(${selectedCurrency.currencyCode})` : ""}
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price"
              className="bg-gray-900 text-cyan-200 border border-cyan-400 rounded px-3 py-2 w-full"
            />
          </div>

          <input
            type="text"
            value={stationBrand}
            onChange={(e) => setStationBrand(e.target.value)}
            placeholder="Station Brand"
            className="bg-gray-900 text-cyan-200 border border-cyan-400 rounded px-3 py-2 w-full"
          />

          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Comments"
            className="bg-gray-900 text-cyan-200 border border-cyan-400 rounded px-3 py-2 w-full"
          />

          <div className="h-64 w-full">
            {lat !== null && lon !== null && (
              <MapContainer
                center={[lat, lon]}
                zoom={13}
                scrollWheelZoom={false}
                className="h-full w-full"
                ref={(ref) => {
                  if (ref) {
                    mapRef.current = ref;
                  }
                }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapClickHandler />
                <Marker position={[lat, lon]} icon={customIcon} />
              </MapContainer>
            )}
          </div>

          <button
            type="button"
            className="mt-2 text-sm text-cyan-400 border border-cyan-400 px-3 py-1 rounded hover:bg-cyan-900"
            onClick={() => {
              navigator.geolocation.getCurrentPosition((pos) => {
                setLat(pos.coords.latitude);
                setLon(pos.coords.longitude);
                mapRef.current?.setView([pos.coords.latitude, pos.coords.longitude], 13);
              });
            }}
          >
            Use My Location
          </button>

          <button
            type="submit"
            className="block w-full text-center mt-4 text-cyan-200 border border-cyan-400 px-4 py-2 rounded hover:bg-cyan-900"
          >
            Save Log
          </button>
        </form>
      </NeonCard>
    </div>
  );
};

export default RefuelForm;
