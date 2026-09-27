import { VehicleType } from './enum/vehicle-type.enum.js';

export interface Vehicle {
  id: string;
  name: string;
  brand: string;
  modelYear: number;
  type: VehicleType;
  available: boolean;
}
