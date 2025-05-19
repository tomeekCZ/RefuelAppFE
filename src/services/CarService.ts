// services/CarService.ts
import type { Car } from "../types/Car";

const API_BASE = "http://localhost:8000/api/cars";

export const CarService = {
  async getCars(): Promise<Car[]> {
    const response = await fetch(API_BASE);
    if (!response.ok) throw new Error("Failed to fetch cars");
    return await response.json();
  },

  async getCar(id: number): Promise<Car> {
    const response = await fetch(`${API_BASE}/${id}`);
    if (!response.ok) throw new Error("Failed to fetch car");
    return await response.json();
  },

  async saveCar(car: Car): Promise<void> {
    const response = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(car),
    });
    if (!response.ok) throw new Error("Failed to save car");
  },

  async updateCar(car: Car): Promise<void> {
    const response = await fetch(`${API_BASE}/${car.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(car),
    });
    if (!response.ok) throw new Error("Failed to update car");
  },

  async deleteCar(id: number): Promise<void> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete car");
  },
};
