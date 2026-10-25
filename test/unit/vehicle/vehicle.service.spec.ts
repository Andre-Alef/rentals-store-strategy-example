import { describe, it, expect } from 'vitest';
import { VehicleService } from '../../../src/vehicle/vehicle.service.js';
import { VehicleType } from '../../../src/vehicle/enum/vehicle-type.enum.js';

describe('VehicleService', () => {
  it('returns available cars', async () => {
    const svc = new VehicleService();
    const cars = await svc.findAvailableByType(VehicleType.CAR);
    expect(cars.length).toBe(2);
    expect(cars.every((v) => v.available && v.type === VehicleType.CAR)).toBe(true);
  });

  it('returns available motorcycles', async () => {
    const svc = new VehicleService();
    const motos = await svc.findAvailableByType(VehicleType.MOTORCYCLE);
    expect(motos.length).toBe(1);
  });

  it('returns empty for e-bike', async () => {
    const svc = new VehicleService();
    const ebikes = await svc.findAvailableByType(VehicleType.E_BIKE);
    expect(ebikes).toEqual([]);
  });
});
