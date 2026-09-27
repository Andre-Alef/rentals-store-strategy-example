import { Injectable } from '@nestjs/common';
import { Customer } from '../../customer/customer.entity.js';
import { Notification } from '../../common/notification/notification.js';
import { RentalRule } from '../rules/rental-rule.interface.js';
import { NoPendingDebitsRule } from '../rules/no-pending-debits.rule.js';
import { MinimumAgeRule } from '../rules/minimum-age.rule.js';
import { VehicleType } from '../../vehicle/enum/vehicle-type.enum.js';
import { VehicleRestrictionStrategy } from './vehicle-restriction.strategy.js';

@Injectable()
export class EBikeRestrictionStrategy implements VehicleRestrictionStrategy {
  readonly vehicleType = VehicleType.E_BIKE;
  private readonly rules: RentalRule[];

  constructor(noPendingDebitsRule: NoPendingDebitsRule) {
    this.rules = [noPendingDebitsRule, new MinimumAgeRule(16, 'e-bike')];
  }

  validate(customer: Customer, notification: Notification): void {
    this.rules.forEach((rule) => rule.validate(customer, notification));
  }
}
