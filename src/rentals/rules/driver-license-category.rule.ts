import { RentalRule } from './rental-rule.interface.js';
import { Customer } from '../../customer/customer.entity.js';
import { Notification } from '../../common/notification/notification.js';

export class DriverLicenseCategoryRule implements RentalRule {
  constructor(
    private readonly allowedCategories: string[],
    private readonly requiredCategoryLabel: string,
    private readonly vehicleLabel: string,
  ) {}

  validate(customer: Customer, notification: Notification): void {
    const customerCategory = customer.driverLicenseCategory?.toUpperCase();

    if (
      !customerCategory ||
      !this.allowedCategories.includes(customerCategory)
    ) {
      notification.addError(
        `Driver license category ${this.requiredCategoryLabel} is required for ${this.vehicleLabel} rentals.`,
      );
    }
  }
}
