import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NeonCard from "../../components/NeonCard";
import NeonButton from "../../components/NeonButton";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import type { Car } from "../../types/Car";
import { fetchFromApi } from "../../services/api";
import { CarService } from "../../services/CarService";


const CarForm: React.FC = () => {
    const navigate = useNavigate();

    const { id } = useParams(); // edit mode if `id` exists

    const [brand, setBrand] = useState("");
    const [model, setModel] = useState("");
    const [vin, setVin] = useState("");
    const [color, setColor] = useState("");
    const [fuelType, setFuelType] = useState("Petrol");
    const [description, setDescription] = useState("");
    const [photo, setPhoto] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [licencePlate, setLicencePlate] = useState("");
    const [cars, setCars] = useState<Car[]>([]);

    useEffect(() => {
        fetchFromApi("cars")
            .then((cars: Car[]) => {
                setCars(cars);
            })
            .catch(console.error);
    }, []);

    useEffect(() => {

        if (id) {
            const carId = parseInt(id);
            const car = cars.find((c) => c.id === carId);
            if (car) {
                setBrand(car.brand);
                setModel(car.model);
                setVin(car.vin ?? "");
                setColor(car.color ?? "");
                setFuelType(car.fuelType);
                setDescription(car.description ?? "");
                setLicencePlate(car.licencePlate ?? "")
            }
        }
    }, [id, cars]);

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPhoto(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemovePhoto = () => {
        setPhoto(null);
        setPreviewUrl(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const updatedCar: Car = {
            id: id ? parseInt(id) : Date.now(),
            brand,
            model,
            vin,
            color,
            fuelType,
            description,
            licencePlate,
            isArchived: false,
        };

        console.log(updatedCar)

        if (id) {
            CarService.updateCar(updatedCar);
            alert("Car updated!");
        } else {
            CarService.saveCar(updatedCar);
            alert("Car saved!");
        }

        navigate("/cars");
    };

    return (
        <div className="min-h-screen bg-black text-white p-4 flex items-center justify-center">
            <NeonCard title={id ? "Edit Car" : "Add Car"} className="w-full max-w-md">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                    <input
                        className="px-4 py-2 bg-gray-800 text-white border border-cyan-400 rounded"
                        type="text"
                        placeholder="Brand"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                    />

                    <input
                        className="px-4 py-2 bg-gray-800 text-white border border-cyan-400 rounded"
                        type="text"
                        placeholder="Model"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                    />

                    <input
                        className="px-4 py-2 bg-gray-800 text-white border border-cyan-400 rounded"
                        type="text"
                        placeholder="VIN"
                        value={vin}
                        onChange={(e) => setVin(e.target.value)}
                    />

                    <input
                        className="px-4 py-2 bg-gray-800 text-white border border-cyan-400 rounded"
                        type="text"
                        placeholder="Licence Plate"
                        value={licencePlate}
                        onChange={(e) => setLicencePlate(e.target.value)}
                    />

                    <input
                        className="px-4 py-2 bg-gray-800 text-white border border-cyan-400 rounded"
                        type="text"
                        placeholder="Color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                    />

                    <select
                        className="px-4 py-2 bg-gray-800 text-white border border-cyan-400 rounded"
                        value={fuelType}
                        onChange={(e) => setFuelType(e.target.value)}
                    >
                        <option>Petrol</option>
                        <option>Diesel</option>
                        <option>Electric</option>
                        <option>Hybrid</option>
                    </select>

                    <textarea
                        className="px-4 py-2 bg-gray-800 text-white border border-cyan-400 rounded"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    {previewUrl && (
                        <>
                            <img
                                src={previewUrl}
                                alt="Car Preview"
                                className="w-24 h-24 rounded-full border-2 border-cyan-400 mx-auto object-cover"
                            />
                            <button
                                type="button"
                                onClick={handleRemovePhoto}
                                className="text-sm text-red-400 hover:underline block mx-auto"
                            >
                                Remove Photo
                            </button>
                        </>
                    )}

                    <label className="text-sm text-cyan-400 hover:underline cursor-pointer text-center">
                        {photo ? "Change Car Photo" : "Upload Car Photo"}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            className="hidden"
                        />
                    </label>

                    <NeonButton type="submit">
                        {id ? "Update Car" : "Save Car"}
                    </NeonButton>
                </form>
            </NeonCard>
        </div>
    );
};

export default CarForm;
