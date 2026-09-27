import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import { RentalsServiceStrategy } from '../../../src/rentals/rentals-strategy.service.js';
import { CustomerService } from '../../../src/customer/customer.service.js';
import { VehicleService } from '../../../src/vehicle/vehicle.service.js';
import { VehicleStrategyRegistry } from '../../../src/rentals/strategies/vehicle-strategy.registry.js';
import { Customer } from '../../../src/customer/customer.entity.js';
import { Vehicle } from '../../../src/vehicle/vehicle.entity.js';
import { VehicleRestrictionStrategy } from '../../../src/rentals/strategies/vehicle-restriction.strategy.js';
import { VehicleType } from '../../../src/vehicle/enum/vehicle-type.enum.js';

describe('RentalsServiceStrategy', () => {
  let rentalsService: RentalsServiceStrategy;
  let customerService: CustomerService;
  let vehicleService: VehicleService;
  let strategyRegistry: VehicleStrategyRegistry;

  const mockCustomer: Customer = {
    id: 'cust-1',
    name: 'John Doe',
    age: 25,
    driverLicenseCategory: 'B',
    hasPendingDebits: false,
    hasActiveViolations: false,
  };

  const mockVehicles: Vehicle[] = [
    {
      id: 'v-1',
      name: 'Corolla',
      brand: 'Toyota',
      modelYear: 2023,
      type: VehicleType.CAR,
      available: true,
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RentalsServiceStrategy,
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
        {
          provide: VehicleStrategyRegistry,
          useValue: {
            getStrategy: vi.fn(),
          },
        },
      ],
    }).compile();

    rentalsService = module.get<RentalsServiceStrategy>(RentalsServiceStrategy);
    customerService = module.get<CustomerService>(CustomerService);
    vehicleService = module.get<VehicleService>(VehicleService);
    strategyRegistry = module.get<VehicleStrategyRegistry>(
      VehicleStrategyRegistry,
    );
  });

  it('should be defined', () => {
    expect(rentalsService).toBeDefined();
  });

  it('should throw NotFoundException if customer is not found', async () => {
    vi.spyOn(customerService, 'findById').mockResolvedValue(null);

    await expect(
      rentalsService.getAvailableVehicles('invalid-id', VehicleType.CAR),
    ).rejects.toThrow(NotFoundException);
  });

  it('should return available vehicles when strategy validation passes', async () => {
    const mockStrategy: VehicleRestrictionStrategy = {
      vehicleType: VehicleType.CAR,
      validate: vi.fn(),
    };

    vi.spyOn(customerService, 'findById').mockResolvedValue(mockCustomer);
    vi.spyOn(strategyRegistry, 'getStrategy').mockReturnValue(mockStrategy);
    vi.spyOn(vehicleService, 'findAvailableByType').mockResolvedValue(
      mockVehicles,
    );

    const result = await rentalsService.getAvailableVehicles(
      'cust-1',
      VehicleType.CAR,
    );

    expect(result.allowed).toBe(true);
    expect(result.vehicles).toEqual(mockVehicles);
    expect(result.reasons).toBeUndefined();
    expect(vehicleService.findAvailableByType).toHaveBeenCalledWith(
      VehicleType.CAR,
    );
  });

  it('should return allowed=false and reasons when strategy validation fails', async () => {
    const mockStrategy: VehicleRestrictionStrategy = {
      vehicleType: VehicleType.CAR,
      validate: vi.fn((_, notification) => {
        notification.addError('Minimum age for car rental is 21 years old.');
      }),
    };

    vi.spyOn(customerService, 'findById').mockResolvedValue(mockCustomer);
    vi.spyOn(strategyRegistry, 'getStrategy').mockReturnValue(mockStrategy);

    const result = await rentalsService.getAvailableVehicles(
      'cust-1',
      VehicleType.CAR,
    );

    expect(result.allowed).toBe(false);
    expect(result.vehicles).toEqual([]);
    expect(result.reasons).toEqual([
      'Minimum age for car rental is 21 years old.',
    ]);
    expect(vehicleService.findAvailableByType).not.toHaveBeenCalled();
  });
});
