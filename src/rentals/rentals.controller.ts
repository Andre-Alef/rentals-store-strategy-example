import { Controller, Get, Query } from '@nestjs/common';
import { ApiQuery, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RentalsService } from './rentals.service.js';
import { RentalsServiceStrategy } from './rentals-strategy.service.js';
import { GetAvailableVehiclesDto } from './dto/get-available-vehicles.dto.js';

@ApiTags('rentals')
@Controller('rentals')
export class RentalsController {
  constructor(
    private readonly rentalsService: RentalsService,
    private readonly rentalsServiceStrategy: RentalsServiceStrategy,
  ) {}

  @Get('available-vehicles-legacy')
  @ApiOperation({ summary: 'Get available vehicles (legacy validation)' })
  @ApiQuery({ name: 'customerId', required: true })
  @ApiQuery({ name: 'vehicleType', enum: ['CAR', 'MOTORCYCLE', 'E_BIKE'], required: true })
  @ApiResponse({ status: 200, description: 'Available vehicles' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  async getAvailableVehiclesLegacy(@Query() dto: GetAvailableVehiclesDto) {
    return this.rentalsService.getAvailableVehicles(dto.customerId, dto.vehicleType);
  }

  @Get('available-vehicles')
  @ApiOperation({ summary: 'Get available vehicles (strategy pattern)' })
  @ApiQuery({ name: 'customerId', required: true })
  @ApiQuery({ name: 'vehicleType', enum: ['CAR', 'MOTORCYCLE', 'E_BIKE'], required: true })
  @ApiResponse({ status: 200, description: 'Available vehicles' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  async getAvailableVehicles(@Query() dto: GetAvailableVehiclesDto) {
    return this.rentalsServiceStrategy.getAvailableVehicles(dto.customerId, dto.vehicleType);
  }
}
