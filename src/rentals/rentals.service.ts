import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CustomerService } from '../customer/customer.service.js';
import { Customer } from '../customer/customer.entity.js';
import { VehicleService } from '../vehicle/vehicle.service.js';
import { Vehicle } from '../vehicle/vehicle.entity.js';
import { VehicleType } from '../vehicle/enum/vehicle-type.enum.js';

export interface GetAvailableVehiclesResponse {
  customerId: string;
  vehicleType: VehicleType;
  allowed: boolean;
  vehicles: Vehicle[];
}

@Injectable()
export class RentalsService {
  constructor(
    private readonly customerService: CustomerService,
    private readonly vehicleService: VehicleService,
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

    this.validateRestrictionsForVehicle(customer, vehicleType);

    const vehicles = await this.vehicleService.findAvailableByType(vehicleType);

    return {
      customerId: customer.id,
      vehicleType,
      allowed: true,
      vehicles,
    };
  }

  private validateRestrictionsForVehicle(
    customer: Customer,
    vehicleType: VehicleType,
  ): void {
    if (customer.hasPendingDebits) {
      throw new BadRequestException(
        'Customer has pending debits on the platform.',
      );
    }

    if (customer.hasActiveViolations) {
      throw new BadRequestException(
        'Customer has active traffic violations registered.',
      );
    }

    if (vehicleType === VehicleType.CAR) {
      if (
        !customer.driverLicenseCategory ||
        !['B', 'C', 'D', 'E', 'AB'].includes(
          customer.driverLicenseCategory.toUpperCase(),
        )
      ) {
        throw new BadRequestException(
          'Driver license category B or higher is required for car rentals.',
        );
      }

      if (customer.age < 21) {
        throw new BadRequestException(
          'Minimum age for car rental is 21 years old.',
        );
      }
    } else if (vehicleType === VehicleType.MOTORCYCLE) {
      if (
        !customer.driverLicenseCategory ||
        !['A', 'AB'].includes(customer.driverLicenseCategory.toUpperCase())
      ) {
        throw new BadRequestException(
          'Driver license category A is required for motorcycle rentals.',
        );
      }

      if (customer.age < 18) {
        throw new BadRequestException(
          'Minimum age for motorcycle rental is 18 years old.',
        );
      }
    } else {
      throw new BadRequestException('Unsupported vehicle type.');
    }
  }
}
