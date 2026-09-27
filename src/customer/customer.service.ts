import { Injectable, NotFoundException } from '@nestjs/common';
import { Customer } from './customer.entity.js';

@Injectable()
export class CustomerService {
  async findById(customerId: string): Promise<Customer> {
    if (!customerId) {
      throw new NotFoundException('Customer not found.');
    }

    return {
      id: customerId,
      name: 'John Doe',
      age: 22,
      driverLicenseCategory: 'B',
      hasPendingDebits: false,
      hasActiveViolations: false,
    };
  }
}
