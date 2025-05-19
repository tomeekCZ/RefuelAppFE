export interface Car {
  id: number;
  brand: string;
  model: string;
  vin: string;
  color?: string;
  fuelType: string;
  description?: string;
  photo?: string;
  isArchived: boolean;
  licencePlate: string;
}