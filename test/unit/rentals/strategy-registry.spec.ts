import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect } from 'vitest';
import { VehicleStrategyRegistry, VEHICLE_STRATEGIES } from '../../../src/rentals/strategies/vehicle-strategy.registry.js';
import { CarRestrictionStrategy } from '../../../src/rentals/strategies/car-restriction.strategy.js';
import { MotorcycleRestrictionStrategy } from '../../../src/rentals/strategies/motorcycle-restriction.strategy.js';
import { EBikeRestrictionStrategy } from '../../../src/rentals/strategies/ebike-restriction.strategy.js';
import { NoPendingDebitsRule } from '../../../src/rentals/rules/no-pending-debits.rule.js';
import { NoActiveViolationsRule } from '../../../src/rentals/rules/no-active-violations.rule.js';
import { VehicleType } from '../../../src/vehicle/enum/vehicle-type.enum.js';
import { BadRequestException } from '@nestjs/common';

describe('VehicleStrategyRegistry', () => {
  it('returns strategy for known type', async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NoPendingDebitsRule,
        NoActiveViolationsRule,
        CarRestrictionStrategy,
        MotorcycleRestrictionStrategy,
        EBikeRestrictionStrategy,
        {
          provide: VEHICLE_STRATEGIES,
          useFactory: (car, moto, ebike) => [car, moto, ebike],
          inject: [CarRestrictionStrategy, MotorcycleRestrictionStrategy, EBikeRestrictionStrategy],
        },
        VehicleStrategyRegistry,
      ],
    }).compile();
    const registry = module.get(VehicleStrategyRegistry);
    expect(registry.getStrategy(VehicleType.CAR)).toBeDefined();
    expect(() => registry.getStrategy('X' as any)).toThrow(BadRequestException);
  });
});
