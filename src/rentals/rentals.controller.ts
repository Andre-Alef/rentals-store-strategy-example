import { Controller, Get, Query } from '@nestjs/common';

import { RentalsService } from './rentals.service.js';
import { RentalsServiceStrategy } from './rentals-strategy.service.js';
import { GetAvailableVehiclesDto } from './dto/get-available-vehicles.dto.js';

@Controller('rentals')
export class RentalsController {
  constructor(
    private readonly rentalsService: RentalsService,
    private readonly rentalsServiceStrategy: RentalsServiceStrategy,
  ) {}

  @Get('available-vehicles-legacy')
  async getAvailableVehiclesLegacy(@Query() dto: GetAvailableVehiclesDto) {
    return this.rentalsService.getAvailableVehicles(
      dto.customerId,
      dto.vehicleType,
    );
  }

  @Get('available-vehicles')
  async getAvailableVehicles(@Query() dto: GetAvailableVehiclesDto) {
    return this.rentalsServiceStrategy.getAvailableVehicles(
      dto.customerId,
      dto.vehicleType,
    );
  }
}
