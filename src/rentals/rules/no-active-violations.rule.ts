import { Injectable } from '@nestjs/common';
import { RentalRule } from './rental-rule.interface.js';
import { Customer } from '../../customer/customer.entity.js';
import { Notification } from '../../common/notification/notification.js';

@Injectable()
export class NoActiveViolationsRule implements RentalRule {
  validate(customer: Customer, notification: Notification): void {
    if (customer.hasActiveViolations) {
      notification.addError(
        'Customer has active traffic violations registered.',
      );
    }
  }
}
