import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import { RentalsService } from '../../../src/rentals/rentals.service.js';
import { CustomerService } from '../../../src/customer/customer.service.js';
import { VehicleService } from '../../../src/vehicle/vehicle.service.js';
import { Customer } from '../../../src/customer/customer.entity.js';
import { Vehicle } from '../../../src/vehicle/vehicle.entity.js';
import { VehicleType } from '../../../src/vehicle/enum/vehicle-type.enum.js';

describe('RentalsService', () => {
  let rentalsService: RentalsService;
  let customerService: CustomerService;
  let vehicleService: VehicleService;

  const mockCustomer: Customer = {
    id: 'cust-1',
    name: 'John Doe',
    age: 22,
    driverLicenseCategory: 'B',
    hasPendingDebits: false,
    hasActiveViolations: false,
  };

  const mockCars: Vehicle[] = [
    {
      id: 'v-1',
      name: 'Corolla 2.0',
      brand: 'Toyota',
      modelYear: 2023,
      type: VehicleType.CAR,
      available: true,
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RentalsService,
        {
          provide: CustomerService,
          useValue: {
            findById: vi.fn(),
          },
        },
        {
          provide: VehicleService,
          useValue: {
            findAvailableByType: vi.fn(),
          },
        },
      ],
    }).compile();

    rentalsService = module.get<RentalsService>(RentalsService);
    customerService = module.get<CustomerService>(CustomerService);
    vehicleService = module.get<VehicleService>(VehicleService);
  });

  it('should throw NotFoundException if customer does not exist', async () => {
    vi.spyOn(customerService, 'findById').mockResolvedValue(
      null as unknown as Customer,
    );

    await expect(
      rentalsService.getAvailableVehicles('invalid-id', VehicleType.CAR),
    ).rejects.toThrow(NotFoundException);
  });

  it('should return available cars when customer meets all requirements', async () => {
    vi.spyOn(customerService, 'findById').mockResolvedValue(mockCustomer);
    vi.spyOn(vehicleService, 'findAvailableByType').mockResolvedValue(mockCars);

    const result = await rentalsService.getAvailableVehicles(
      'cust-1',
      VehicleType.CAR,
    );

    expect(result.allowed).toBe(true);
    expect(result.vehicles).toEqual(mockCars);
  });

  it('should throw BadRequestException when customer has restrictions', async () => {
    vi.spyOn(customerService, 'findById').mockResolvedValue(mockCustomer);

    await expect(
      rentalsService.getAvailableVehicles('cust-1', VehicleType.MOTORCYCLE),
    ).rejects.toThrow(BadRequestException);
  });
});
