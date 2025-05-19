export interface RefuelLog {
    id: number;
    userId: number;
    carId: number;
    date: string;
    mileage: number;
    liters: number;
    price: number;
    currencyId: number;
    stationBrand: string;
    comments?: string;
    lat?: number;
    lon?: number;
  }
  