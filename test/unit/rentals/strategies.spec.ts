import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { CarRestrictionStrategy } from '../../../src/rentals/strategies/car-restriction.strategy.js';
import { MotorcycleRestrictionStrategy } from '../../../src/rentals/strategies/motorcycle-restriction.strategy.js';
import { EBikeRestrictionStrategy } from '../../../src/rentals/strategies/ebike-restriction.strategy.js';
import { NoPendingDebitsRule } from '../../../src/rentals/rules/no-pending-debits.rule.js';
import { NoActiveViolationsRule } from '../../../src/rentals/rules/no-active-violations.rule.js';
import { Notification } from '../../../src/common/notification/notification.js';
import { Customer } from '../../../src/customer/customer.entity.js';
import { VehicleType } from '../../../src/vehicle/enum/vehicle-type.enum.js';

describe('Strategies', () => {
  let car: CarRestrictionStrategy;
  let moto: MotorcycleRestrictionStrategy;
  let ebike: EBikeRestrictionStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NoPendingDebitsRule, NoActiveViolationsRule, CarRestrictionStrategy, MotorcycleRestrictionStrategy, EBikeRestrictionStrategy],
    }).compile();
    car = module.get(CarRestrictionStrategy);
    moto = module.get(MotorcycleRestrictionStrategy);
    ebike = module.get(EBikeRestrictionStrategy);
  });

  const base: Customer = { id: '1', name: 'x', age: 25, driverLicenseCategory: 'B', hasPendingDebits: false, hasActiveViolations: false };

  it('car validates', () => {
    const n = new Notification();
    car.validate(base, n);
    expect(n.hasErrors()).toBe(false);
    const n2 = new Notification();
    car.validate({ ...base, age: 18, driverLicenseCategory: 'A' }, n2);
    expect(n2.hasErrors()).toBe(true);
    const n3 = new Notification();
    car.validate({ ...base, driverLicenseCategory: undefined }, n3);
    expect(n3.hasErrors()).toBe(true);
  });

  it('motorcycle validates', () => {
    const n = new Notification();
    moto.validate({ ...base, driverLicenseCategory: 'A', age: 18 }, n);
    expect(n.hasErrors()).toBe(false);
  });

  it('ebike validates', () => {
    const n = new Notification();
    ebike.validate({ ...base, age: 16 }, n);
    expect(n.hasErrors()).toBe(false);
    const n2 = new Notification();
    ebike.validate({ ...base, age: 10 }, n2);
    expect(n2.hasErrors()).toBe(true);
    const n3 = new Notification();
    ebike.validate({ ...base, hasPendingDebits: true }, n3);
    expect(n3.hasErrors()).toBe(true);
  });

  it('vehicleType props', () => {
    expect(car.vehicleType).toBe(VehicleType.CAR);
    expect(moto.vehicleType).toBe(VehicleType.MOTORCYCLE);
    expect(ebike.vehicleType).toBe(VehicleType.E_BIKE);
  });
});
