import { Injectable } from '@nestjs/common';
import { Vehicle } from './vehicle.entity.js';
import { VehicleType } from './enum/vehicle-type.enum.js';

@Injectable()
export class VehicleService {
  private readonly mockVehiclesDatabase: Vehicle[] = [
    {
      id: 'v-1',
      name: 'Corolla 2.0',
      brand: 'Toyota',
      modelYear: 2023,
      type: VehicleType.CAR,
      available: true,
    },
    {
      id: 'v-2',
      name: 'Civic 2.0',
      brand: 'Honda',
      modelYear: 2022,
      type: VehicleType.CAR,
      available: true,
    },
    {
      id: 'v-3',
      name: 'CB 500F',
      brand: 'Honda',
      modelYear: 2023,
      type: VehicleType.MOTORCYCLE,
      available: true,
    },
  ];

  async findAvailableByType(type: VehicleType): Promise<Vehicle[]> {
    return this.mockVehiclesDatabase.filter(
      (vehicle) => vehicle.type === type && vehicle.available,
    );
  }
}
