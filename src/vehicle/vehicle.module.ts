import { Module } from '@nestjs/common';
import { VehicleService } from './vehicle.service.js';

@Module({
  providers: [VehicleService],
  exports: [VehicleService],
})
export class VehicleModule {}
