import { Injectable } from '@nestjs/common';
import { Customer } from '../../customer/customer.entity.js';
import { Notification } from '../../common/notification/notification.js';
import { RentalRule } from '../rules/rental-rule.interface.js';
import { NoPendingDebitsRule } from '../rules/no-pending-debits.rule.js';
import { NoActiveViolationsRule } from '../rules/no-active-violations.rule.js';
import { MinimumAgeRule } from '../rules/minimum-age.rule.js';
import { DriverLicenseCategoryRule } from '../rules/driver-license-category.rule.js';
import { VehicleRestrictionStrategy } from './vehicle-restriction.strategy.js';
import { VehicleType } from '../../vehicle/enum/vehicle-type.enum.js';

@Injectable()
export class MotorcycleRestrictionStrategy implements VehicleRestrictionStrategy {
  readonly vehicleType = VehicleType.MOTORCYCLE;
  private readonly rules: RentalRule[];

  constructor(
    noPendingDebitsRule: NoPendingDebitsRule,
    noActiveViolationsRule: NoActiveViolationsRule,
  ) {
    this.rules = [
      noPendingDebitsRule,
      noActiveViolationsRule,
      new DriverLicenseCategoryRule(['A', 'AB'], 'A', 'motorcycle'),
      new MinimumAgeRule(18, 'motorcycle'),
    ];
  }

  validate(customer: Customer, notification: Notification): void {
    this.rules.forEach((rule) => rule.validate(customer, notification));
  }
}
