import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service.js';

@Module({
  providers: [CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}
