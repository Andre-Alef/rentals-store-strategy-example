import { Test, TestingModule } from '@nestjs/testing';
import { describe, beforeEach, it, expect } from 'vitest';
import { Notification } from '../../../../src/common/notification/notification';
import { Customer } from '../../../../src/customer/customer.entity';
import { NoPendingDebitsRule } from '../../../../src/rentals/rules/no-pending-debits.rule';
import { NoActiveViolationsRule } from '../../../../src/rentals/rules/no-active-violations.rule';
import { MinimumAgeRule } from '../../../../src/rentals/rules/minimum-age.rule';
import { DriverLicenseCategoryRule } from '../../../../src/rentals/rules/driver-license-category.rule';

describe('Rental Rules (Atomic Unit Tests)', () => {
  let noPendingDebitsRule: NoPendingDebitsRule;
  let noActiveViolationsRule: NoActiveViolationsRule;
  let notification: Notification;

  const baseCustomer: Customer = {
    id: 'cust-1',
    name: 'John Doe',
    age: 25,
    driverLicenseCategory: 'B',
    hasPendingDebits: false,
    hasActiveViolations: false,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NoPendingDebitsRule, NoActiveViolationsRule],
    }).compile();

    noPendingDebitsRule = module.get<NoPendingDebitsRule>(NoPendingDebitsRule);
    noActiveViolationsRule = module.get<NoActiveViolationsRule>(
      NoActiveViolationsRule,
    );
    notification = new Notification();
  });

  describe('NoPendingDebitsRule', () => {
    it('should add error if customer has pending debits', () => {
      noPendingDebitsRule.validate(
        { ...baseCustomer, hasPendingDebits: true },
        notification,
      );

      expect(notification.hasErrors()).toBe(true);
      expect(notification.getMessages()).toContain(
        'Customer has pending debits on the platform.',
      );
    });

    it('should pass if customer has no pending debits', () => {
      noPendingDebitsRule.validate(baseCustomer, notification);

      expect(notification.hasErrors()).toBe(false);
    });
  });

  describe('NoActiveViolationsRule', () => {
    it('should add error if customer has active violations', () => {
      noActiveViolationsRule.validate(
        { ...baseCustomer, hasActiveViolations: true },
        notification,
      );

      expect(notification.hasErrors()).toBe(true);
      expect(notification.getMessages()).toContain(
        'Customer has active traffic violations registered.',
      );
    });

    it('should pass if customer has no active violations', () => {
      noActiveViolationsRule.validate(baseCustomer, notification);

      expect(notification.hasErrors()).toBe(false);
    });
  });

  describe('MinimumAgeRule', () => {
    const rule = new MinimumAgeRule(21, 'car');

    it('should add error if customer age is below minimum', () => {
      rule.validate({ ...baseCustomer, age: 20 }, notification);

      expect(notification.hasErrors()).toBe(true);
      expect(notification.getMessages()).toContain(
        'Minimum age for car rental is 21 years old.',
      );
    });

    it('should pass if customer age meets requirement', () => {
      rule.validate({ ...baseCustomer, age: 21 }, notification);

      expect(notification.hasErrors()).toBe(false);
    });
  });

  describe('DriverLicenseCategoryRule', () => {
    const rule = new DriverLicenseCategoryRule(['A', 'AB'], 'A', 'motorcycle');

    it('should add error if customer category is invalid', () => {
      rule.validate(
        { ...baseCustomer, driverLicenseCategory: 'B' },
        notification,
      );

      expect(notification.hasErrors()).toBe(true);
      expect(notification.getMessages()).toContain(
        'Driver license category A is required for motorcycle rentals.',
      );
    });

    it('should pass if customer category matches required list', () => {
      rule.validate(
        { ...baseCustomer, driverLicenseCategory: 'AB' },
        notification,
      );

      expect(notification.hasErrors()).toBe(false);
    });
  });
});
