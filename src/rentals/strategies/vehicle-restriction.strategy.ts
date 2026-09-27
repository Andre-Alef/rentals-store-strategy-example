import { Customer } from '../../customer/customer.entity.js';
import { Notification } from '../../common/notification/notification.js';
import { VehicleType } from '../../vehicle/enum/vehicle-type.enum.js';

export interface VehicleRestrictionStrategy {
  readonly vehicleType: VehicleType;
  validate(customer: Customer, notification: Notification): void;
}
