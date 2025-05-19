import React, { useEffect, useState, useRef } from "react";
import { LogService } from "../../services/LogService";
import type { RefuelLog } from "../../types/RefuelLog";
import type { Car } from "../../types/Car";
import type { Currency } from "../../types/Currency";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, MapPin, Pencil, Trash2 } from "lucide-react";
import { fetchFromApi } from "../../services/api";

const LogHistory: React.FC = () => {
  const [logs, setLogs] = useState<RefuelLog[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [selectedCarId, setSelectedCarId] = useState<number | "all">("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortBy, setSortBy] = useState<"mileage" | "liters" | "price" | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const startRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

useEffect(() => {
    LogService.getLogs().then(setLogs);
  
    fetchFromApi("cars")
      .then((cars: Car[]) => {
        setCars(cars);
      })
      .catch(console.error);
  
    fetchFromApi("currencies")
      .then(setCurrencies)
      .catch((err) => console.error("Failed to load currencies", err));
  }, []);

  const filteredLogs = logs.filter((log) => {
    if (selectedCarId !== "all" && log.carId !== selectedCarId) return false;
    if (startDate && log.date < startDate) return false;
    if (endDate && log.date > endDate) return false;
    return true;
  });

  const sortedLogs = [...filteredLogs];
  if (sortBy) {
    sortedLogs.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
    });
  }

  const totals = filteredLogs.reduce(
    (acc, log) => {
      acc.mileage += log.mileage;
      acc.liters += log.liters;
      acc.price += log.price;
      return acc;
    },
    { mileage: 0, liters: 0, price: 0 }
  );

  const carMap = new Map<number, string>();
  cars.forEach((car) => {
    carMap.set(car.id, `${car.brand} ${car.model}`);
  });

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this log?")) return;
    await LogService.deleteLog(id);
    setLogs((prev) => prev.filter((log) => log.id !== id));
  };

  const toggleSort = (column: "mileage" | "liters" | "price") => {
    if (sortBy === column) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (column: "mileage" | "liters" | "price") => {
    if (sortBy !== column) return null;
    return sortDirection === "asc" ? "▲" : "▼";
  };

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <h1 className="text-2xl font-bold text-cyan-400 mb-4">Refueling History</h1>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-4 items-end">
        <button
          onClick={() => {
            localStorage.setItem("mapLogs", JSON.stringify(filteredLogs));
            navigate("/logs/map");
          }}
          className="text-sm text-cyan-400 border border-cyan-400 px-3 py-2 rounded hover:bg-cyan-900"
        >
          Show All on Map
        </button>

        <div className="flex flex-col">
          <label className="text-cyan-400 text-sm mb-1">Filter by Car</label>
          <select
            value={selectedCarId}
            onChange={(e) =>
              setSelectedCarId(e.target.value === "all" ? "all" : parseInt(e.target.value))
            }
            className="bg-gray-900 text-cyan-200 border border-cyan-400 rounded px-3 py-2"
          >
            <option value="all">All Cars</option>
            {cars.map((car) => (
              <option key={car.id} value={car.id}>
                {car.brand} {car.model}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col relative">
          <label className="text-cyan-400 text-sm mb-1">Start Date</label>
          <input
            ref={startRef}
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-gray-900 text-cyan-200 border border-cyan-400 rounded px-3 py-2 pr-10 appearance-none"
          />
          <Calendar
            size={18}
            className="absolute right-3 bottom-2 text-cyan-400 cursor-pointer"
            onClick={() => startRef.current?.showPicker?.()}
          />
        </div>

        <div className="flex flex-col relative">
          <label className="text-cyan-400 text-sm mb-1">End Date</label>
          <input
            ref={endRef}
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-gray-900 text-cyan-200 border border-cyan-400 rounded px-3 py-2 pr-10 appearance-none"
          />
          <Calendar
            size={18}
            className="absolute right-3 bottom-2 text-cyan-400 cursor-pointer"
            onClick={() => endRef.current?.showPicker?.()}
          />
        </div>

        <div className="flex flex-col">
          <label className="invisible text-sm mb-1">Clear</label>
          <button
            type="button"
            onClick={() => {
              setSelectedCarId("all");
              setStartDate("");
              setEndDate("");
            }}
            className="text-sm text-red-400 border border-red-500 px-3 py-2 rounded hover:bg-red-900 transition"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Table */}
      {filteredLogs.length === 0 ? (
        <p className="text-cyan-200">No logs found.</p>
      ) : (
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-sm sm:text-base border border-cyan-500 rounded overflow-hidden">
            <thead className="bg-gray-900 text-cyan-300">
              <tr>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Car</th>
                <th onClick={() => toggleSort("mileage")} className="px-4 py-2 cursor-pointer hover:underline">Mileage (km) {getSortIcon("mileage")}</th>
                <th onClick={() => toggleSort("liters")} className="px-4 py-2 cursor-pointer hover:underline">Liters {getSortIcon("liters")}</th>
                <th onClick={() => toggleSort("price")} className="px-4 py-2 cursor-pointer hover:underline">Price {getSortIcon("price")}</th>
                <th className="px-4 py-2 text-center">Location</th>
                <th className="hidden sm:table-cell px-4 py-2">Comment</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedLogs.map((log) => (
                <tr key={log.id} className="border-t border-cyan-800 hover:bg-gray-800">
                  <td className="px-2 py-1 sm:px-4 sm:py-2">{log.date}</td>
                  <td className="px-2 py-1 sm:px-4 sm:py-2">{carMap.get(log.carId) ?? `Car #${log.carId}`}</td>
                  <td className="px-2 py-1 sm:px-4 sm:py-2 text-right">{log.mileage}</td>
                  <td className="px-2 py-1 sm:px-4 sm:py-2 text-right">{log.liters}</td>
                  <td className="px-2 py-1 sm:px-4 sm:py-2 text-right">
                    {log.price}{" "}
                    {currencies.find((c) => c.currencyId === log.currencyId)?.currencyCode || ""}
                  </td>
                  <td className="px-2 py-1 sm:px-4 sm:py-2 text-center">
                    {log.lat && log.lon ? (
                      <div className="flex justify-center items-center">
                        <a
                          href={`https://www.google.com/maps?q=${log.lat},${log.lon}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:text-cyan-300"
                          title="View Location"
                        >
                          <MapPin size={18} />
                        </a>
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="hidden sm:table-cell px-2 py-1 sm:px-4 sm:py-2">
                    {log.comments || "-"}
                  </td>
                  <td className="px-2 py-1 sm:px-4 sm:py-2 text-center">
                    <div className="flex justify-center items-center gap-3">
                      <Link
                        to={`/logs/edit/${log.id}`}
                        className="text-cyan-400 hover:text-cyan-300"
                        title="Edit"
                      >
                        <Pencil size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(log.id)}
                        title="Delete"
                        className="hover:opacity-80"
                      >
                        <Trash2 size={18} stroke="#ef4444" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-900 text-cyan-300 border-t border-cyan-700">
              <tr>
                <td className="px-4 py-2 font-semibold" colSpan={2}>
                  Totals
                </td>
                <td className="px-4 py-2 font-semibold text-right">
                  {totals.mileage.toFixed(1)}
                </td>
                <td className="px-4 py-2 font-semibold text-right">
                  {totals.liters.toFixed(2)}
                </td>
                <td className="px-4 py-2 font-semibold text-right">
                  {totals.price.toFixed(2)}
                </td>
                <td colSpan={3}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
};

export default LogHistory;
