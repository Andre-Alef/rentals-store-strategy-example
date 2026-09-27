import { RentalRule } from './rental-rule.interface.js';
import { Customer } from '../../customer/customer.entity.js';
import { Notification } from '../../common/notification/notification.js';

export class MinimumAgeRule implements RentalRule {
  constructor(
    private readonly minAge: number,
    private readonly vehicleLabel: string,
  ) {}

  validate(customer: Customer, notification: Notification): void {
    if (customer.age < this.minAge) {
      notification.addError(
        `Minimum age for ${this.vehicleLabel} rental is ${this.minAge} years old.`,
      );
    }
  }
}
