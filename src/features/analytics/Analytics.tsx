import React from "react";
import NeonCard from "../../components/NeonCard";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { LogService } from "../../services/LogService";
import { useState, useRef, useEffect } from "react";
import type { TooltipProps } from "recharts";
import { Calendar } from "lucide-react";
import type { Car } from "../../types/Car";
import type { User } from "../../types/User";
import type { Currency } from "../../types/Currency";
import type { RefuelLog } from "../../types/RefuelLog";
import { fetchFromApi } from "../../services/api";

const currentUser: User = JSON.parse(localStorage.getItem("currentUser") || "{}");

const Analytics: React.FC = () => {

    const [selectedMonth, setSelectedMonth] = useState<string>("all");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const startDateRef = useRef<HTMLInputElement>(null);
    const endDateRef = useRef<HTMLInputElement>(null);

    const [selectedCarId, setSelectedCarId] = useState<number | "all">("all");
    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [cars, setCars] = useState<Car[]>([]);
    const currencyCode = currencies.find(
        (c) => c.currencyId === currentUser.preferredCurrencyId
    )?.currencyCode;

    const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-gray-900 text-cyan-400 border border-cyan-400 rounded px-3 py-2 text-sm shadow-lg">
                    <p className="font-semibold">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index}>
                            {entry.name}: {Number(entry.value).toFixed(2)} {currencyCode}
                        </p>
                    ))}
                </div>
            );
        }

        return null;
    };

    const [logs, setLogs] = useState<RefuelLog[]>([]);

    useEffect(() => {
        LogService.getLogs()
            .then(setLogs)
            .catch((err) => console.error("Failed to load logs", err));

        fetchFromApi("currencies")
            .then(setCurrencies)
            .catch((err) => console.error("Failed to load currencies", err));

        fetchFromApi("cars")
            .then((cars: Car[]) => {
                setCars(cars);
            })
            .catch(console.error);
    }, []);


    const filteredLogs = logs.filter((log) => {
        if (selectedCarId !== "all" && log.carId !== selectedCarId) return false;

        const entryDate = log.date.slice(0, 7); // "YYYY-MM"
        if (selectedMonth !== "all" && entryDate !== selectedMonth) return false;
        if (startDate && entryDate < startDate.slice(0, 7)) return false;
        if (endDate && entryDate > endDate.slice(0, 7)) return false;

        return true;
    });

    const chartData = filteredLogs.map((log) => ({
        date: log.date.slice(0, 7),
        mileage: log.mileage,
        liters: log.liters,
        price: log.price,
        costPerKm: log.price / log.mileage,
        efficiency: log.mileage / log.liters,
    }));

    const allMonths = Array.from(
        new Set(logs.map((log) => log.date.slice(0, 7))) // "YYYY-MM"
    ).sort();


    // You’ll later filter your data like this:
    const filteredData = chartData.filter((entry) => {
        const entryDate = entry.date; // format: "YYYY-MM"
        if (selectedMonth !== "all" && entryDate !== selectedMonth) return false;

        if (startDate && entryDate < startDate.slice(0, 7)) return false;
        if (endDate && entryDate > endDate.slice(0, 7)) return false;

        return true;
    });

    const totalMileage = filteredData.reduce((sum, log) => sum + log.mileage, 0);
    const totalLiters = filteredData.reduce((sum, log) => sum + log.liters, 0);
    const totalPrice = filteredData.reduce((sum, log) => sum + log.price, 0);

    const avgCostPerKm = totalMileage ? totalPrice / totalMileage : 0;
    const avgEfficiency = totalLiters ? totalMileage / totalLiters : 0;


    return (
        <div className="min-h-screen bg-black text-white p-4 space-y-6">
            <h1 className="text-2xl font-bold text-cyan-400">Analytics</h1>



            <div className="flex flex-wrap gap-4 justify-end mb-4 items-end">

                <div className="flex flex-col">
                    <label className="text-cyan-400 text-sm mb-1">Car</label>
                    <select
                        value={selectedCarId}
                        onChange={(e) => {
                            const val = e.target.value;
                            setSelectedCarId(val === "all" ? "all" : parseInt(val));
                        }}
                        className="bg-gray-900 text-cyan-200 border border-cyan-400 rounded px-3 py-1"
                    >
                        <option value="all">All Cars</option>
                        {cars.map((car) => (
                            <option key={car.id} value={car.id}>
                                {car.brand} {car.model}
                            </option>
                        ))}
                    </select>
                </div>


                <div className="flex flex-col">
                    <label className="text-cyan-400 text-sm mb-1">Month</label>
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="bg-gray-900 text-cyan-200 border border-cyan-400 rounded px-3 py-1"
                    >
                        <option value="all">All Months</option>
                        {allMonths.map((month) => (
                            <option key={month} value={month}>
                                {month}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Start Date */}
                <div className="flex flex-col w-44 relative">
                    <label className="text-cyan-400 text-sm mb-1">From</label>
                    <input
                        ref={startDateRef}
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="bg-gray-900 text-cyan-200 border border-cyan-400 rounded px-3 py-1 pr-10 w-full appearance-none focus:outline-none"
                    />
                    <Calendar
                        size={18}
                        className="absolute right-3 bottom-2 text-cyan-400 cursor-pointer"
                        onClick={() => startDateRef.current?.showPicker?.()}
                    />
                </div>

                {/* End Date */}
                <div className="flex flex-col w-44 relative">
                    <label className="text-cyan-400 text-sm mb-1">To</label>
                    <input
                        ref={endDateRef}
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="bg-gray-900 text-cyan-200 border border-cyan-400 rounded px-3 py-1 pr-10 w-full appearance-none focus:outline-none"
                    />
                    <Calendar
                        size={18}
                        className="absolute right-3 bottom-2 text-cyan-400 cursor-pointer"
                        onClick={() => endDateRef.current?.showPicker?.()}
                    />
                </div>

                <button
                    type="button"
                    onClick={() => {
                        setSelectedMonth("all");
                        setStartDate("");
                        setEndDate("");
                        setSelectedCarId("all");
                    }}
                    className="text-sm text-red-400 border border-red-500 rounded px-3 py-[0.375rem] h-[35px] hover:bg-red-900 transition"
                >
                    Clear Filters
                </button>

            </div>



            <NeonCard title="Price">
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={filteredData}>
                            <XAxis dataKey="date" stroke="#00ffff" />
                            <YAxis stroke="#00ffff" />
                            <Tooltip content={<CustomTooltip />} />
                            <Line type="monotone" dataKey="price" stroke="#00ffff" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </NeonCard>

            <NeonCard title="Liters">
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={filteredData}>
                            <XAxis dataKey="date" stroke="#00ffff" />
                            <YAxis stroke="#00ffff" />
                            <Tooltip content={<CustomTooltip />} />
                            <Line type="monotone" dataKey="liters" stroke="#00ffff" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </NeonCard>

            <NeonCard title="Quick Stats">
                <ul className="text-sm text-cyan-200 space-y-1">
                    <li><span className="text-cyan-400">Total Distance:</span> {totalMileage.toFixed(1)} km</li>
                    <li><span className="text-cyan-400">Total Fuel:</span> {totalLiters.toFixed(2)} L</li>
                    <li><span className="text-cyan-400">Total Cost:</span> {totalPrice.toFixed(2)} CZK</li>
                    <li><span className="text-cyan-400">Avg Cost per km:</span> {avgCostPerKm.toFixed(2)} CZK/km</li>
                    <li><span className="text-cyan-400">Avg Fuel Efficiency:</span> {avgEfficiency.toFixed(2)} km/L</li>
                </ul>
            </NeonCard>

        </div>
    );
};

export default Analytics;
