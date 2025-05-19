import React, { useEffect, useState } from "react";
import NeonCard from "../../components/NeonCard";
import NeonButton from "../../components/NeonButton";
import { Link } from "react-router-dom";
import type { Car } from "../../types/Car";
import type { User } from "../../types/User";
import { fetchFromApi } from "../../services/api";
import { CarService } from "../../services/CarService";


const CarList: React.FC = () => {
    const [cars, setCars] = useState<Car[]>([]);
    const [showArchived, setShowArchived] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {

        fetchFromApi("cars")
            .then((cars: Car[]) => {
                setCars(cars);
            })
            .catch(console.error);

        const storedUser: User = JSON.parse(localStorage.getItem("currentUser") || "{}");
        setCurrentUser(storedUser);
    }, []);

    const handleArchive = async (id: number) => {
        const carToUpdate = cars.find((car) => car.id === id);
        if (!carToUpdate) return;

        const updatedCar: Car = {
            ...carToUpdate,
            isArchived: true,
        };

        try {
            await CarService.updateCar(updatedCar);
            setCars((prevCars) =>
                prevCars.map((car) => (car.id === id ? updatedCar : car))
            );
        } catch (error) {
            console.error("Failed to archive car:", error);
        }
    };


    const handleSetPrimary = (id: number) => {
        const updatedUser = { ...currentUser, primaryCarId: id } as User;
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);
    };

    return (
        <div className="min-h-screen bg-black text-white p-4 space-y-6">
            <h1 className="text-2xl font-bold text-cyan-400">My Cars</h1>

            <div className="space-y-4">
                <div className="flex justify-end mb-2">
                    <button
                        onClick={() => setShowArchived((prev) => !prev)}
                        className="text-sm text-cyan-400 hover:underline"
                    >
                        {showArchived ? "Hide Archived Cars" : "Show Archived Cars"}
                    </button>
                </div>

                {cars
                    .filter((car) => !car.isArchived || showArchived)
                    .map((car) => (
                        <NeonCard key={car.id} title={`${car.brand} ${car.model}`}>
                            <div className="flex justify-between items-center">
                                <div className="text-sm">
                                    <p>Licence Plate: {car.licencePlate}</p>
                                    {currentUser?.primaryCarId === car.id && (
                                        <p className="text-green-400 mt-1">Primary Car</p>
                                    )}
                                    {car.isArchived && <p className="text-red-400 mt-1">Archived</p>}
                                </div>
                                <div className="flex gap-2">
                                    <Link to={`/cars/edit/${car.id}`}>
                                        <NeonButton className="text-xs px-3 py-1">Edit</NeonButton>
                                    </Link>
                                    {!car.isArchived && (
                                        <NeonButton
                                            className="text-xs px-3 py-1"
                                            onClick={() => handleArchive(car.id)}
                                        >
                                            Archive
                                        </NeonButton>
                                    )}
                                    {!car.isArchived && currentUser?.primaryCarId !== car.id && (
                                        <NeonButton
                                            className="text-xs px-3 py-1"
                                            onClick={() => handleSetPrimary(car.id)}
                                        >
                                            Set Primary
                                        </NeonButton>
                                    )}
                                </div>
                            </div>
                        </NeonCard>
                    ))}
            </div>

            <div className="flex justify-center">
                <Link to="/cars/add">
                    <NeonButton>Add New Car</NeonButton>
                </Link>
            </div>
        </div>
    );
};

export default CarList;
