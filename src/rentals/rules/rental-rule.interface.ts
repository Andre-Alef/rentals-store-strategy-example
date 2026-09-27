import { Customer } from '../../customer/customer.entity.js';
import { Notification } from '../../common/notification/notification.js';

export interface RentalRule {
  validate(customer: Customer, notification: Notification): void;
}
