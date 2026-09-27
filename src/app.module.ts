import { Module } from '@nestjs/common';
import { CustomerModule } from './customer/customer.module.js';
import { RentalsModule } from './rentals/rentals.module.js';
import { VehicleModule } from './vehicle/vehicle.module.js';

@Module({
  imports: [CustomerModule, VehicleModule, RentalsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
