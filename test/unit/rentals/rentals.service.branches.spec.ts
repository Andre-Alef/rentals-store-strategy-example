import { Test, TestingModule } from '@nestjs/testing';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { RentalsService } from '../../../src/rentals/rentals.service.js';
import { CustomerService } from '../../../src/customer/customer.service.js';
import { VehicleService } from '../../../src/vehicle/vehicle.service.js';
import { Customer } from '../../../src/customer/customer.entity.js';
import { VehicleType } from '../../../src/vehicle/enum/vehicle-type.enum.js';

describe('RentalsService branches', () => {
  let service: RentalsService;
  let customerService: CustomerService;
  let vehicleService: VehicleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RentalsService,
        { provide: CustomerService, useValue: { findById: vi.fn() } },
        { provide: VehicleService, useValue: { findAvailableByType: vi.fn() } },
      ],
    }).compile();
    service = module.get(RentalsService);
    customerService = module.get(CustomerService);
    vehicleService = module.get(VehicleService);
  });

  const cust: Customer = { id: 'c', name: 'n', age: 25, driverLicenseCategory: 'B', hasPendingDebits: false, hasActiveViolations: false };

  it('pending debits throws', async () => {
    vi.spyOn(customerService, 'findById').mockResolvedValue({ ...cust, hasPendingDebits: true });
    await expect(service.getAvailableVehicles('c', VehicleType.CAR)).rejects.toThrow(BadRequestException);
  });
  it('active violations throws', async () => {
    vi.spyOn(customerService, 'findById').mockResolvedValue({ ...cust, hasActiveViolations: true });
    await expect(service.getAvailableVehicles('c', VehicleType.CAR)).rejects.toThrow(BadRequestException);
  });
  it('car license invalid', async () => {
    vi.spyOn(customerService, 'findById').mockResolvedValue({ ...cust, driverLicenseCategory: 'A' });
    await expect(service.getAvailableVehicles('c', VehicleType.CAR)).rejects.toThrow(BadRequestException);
  });
  it('car age invalid', async () => {
    vi.spyOn(customerService, 'findById').mockResolvedValue({ ...cust, age: 18 });
    await expect(service.getAvailableVehicles('c', VehicleType.CAR)).rejects.toThrow(BadRequestException);
  });
  it('motorcycle license invalid', async () => {
    vi.spyOn(customerService, 'findById').mockResolvedValue({ ...cust, driverLicenseCategory: 'B' });
    await expect(service.getAvailableVehicles('c', VehicleType.MOTORCYCLE)).rejects.toThrow(BadRequestException);
  });
  it('motorcycle age invalid', async () => {
    vi.spyOn(customerService, 'findById').mockResolvedValue({ ...cust, driverLicenseCategory: 'A', age: 16 });
    await expect(service.getAvailableVehicles('c', VehicleType.MOTORCYCLE)).rejects.toThrow(BadRequestException);
  });
  it('unsupported type', async () => {
    vi.spyOn(customerService, 'findById').mockResolvedValue(cust);
    await expect(service.getAvailableVehicles('c', 'X' as any)).rejects.toThrow(BadRequestException);
  });
  it('not found', async () => {
    vi.spyOn(customerService, 'findById').mockResolvedValue(null as any);
    await expect(service.getAvailableVehicles('c', VehicleType.CAR)).rejects.toThrow(NotFoundException);
  });
  it('motorcycle success', async () => {
    vi.spyOn(customerService, 'findById').mockResolvedValue({ ...cust, driverLicenseCategory: 'A', age: 20 });
    vi.spyOn(vehicleService, 'findAvailableByType').mockResolvedValue([]);
    const r = await service.getAvailableVehicles('c', VehicleType.MOTORCYCLE);
    expect(r.allowed).toBe(true);
  });
});
