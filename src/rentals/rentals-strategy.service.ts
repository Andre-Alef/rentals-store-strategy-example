import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomerService } from '../customer/customer.service.js';
import { VehicleService } from '../vehicle/vehicle.service.js';
import { Vehicle } from '../vehicle/vehicle.entity.js';
import { VehicleStrategyRegistry } from './strategies/vehicle-strategy.registry.js';
import { Notification } from '../common/notification/notification.js';
import { VehicleType } from '../vehicle/enum/vehicle-type.enum.js';

export interface GetAvailableVehiclesResponse {
  customerId: string;
  vehicleType: VehicleType;
  allowed: boolean;
  vehicles: Vehicle[];
  reasons?: string[];
}

@Injectable()
export class RentalsServiceStrategy {
  constructor(
    private readonly customerService: CustomerService,
    private readonly vehicleService: VehicleService,
    private readonly strategyRegistry: VehicleStrategyRegistry,
  ) {}

  async getAvailableVehicles(
    customerId: string,
    vehicleType: VehicleType,
  ): Promise<GetAvailableVehiclesResponse> {
    const customer = await this.customerService.findById(customerId);

    if (!customer) {
      throw new NotFoundException(
        `Customer with ID "${customerId}" not found.`,
      );
    }

    const strategy = this.strategyRegistry.getStrategy(vehicleType);
    const notification = new Notification();

    strategy.validate(customer, notification);

    const allowed = !notification.hasErrors();

    const vehicles = allowed
      ? await this.vehicleService.findAvailableByType(vehicleType)
      : [];

    return {
      customerId: customer.id,
      vehicleType,
      allowed,
      vehicles,
      ...(notification.hasErrors() && { reasons: notification.getMessages() }),
    };
  }
}
