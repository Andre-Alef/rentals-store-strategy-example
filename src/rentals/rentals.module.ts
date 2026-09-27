import { Module } from '@nestjs/common';
import { RentalsController } from './rentals.controller.js';
import { RentalsService } from './rentals.service.js';
import { CustomerModule } from '../customer/customer.module.js';
import { VehicleModule } from '../vehicle/vehicle.module.js';
import { CarRestrictionStrategy } from './strategies/car-restriction.strategy.js';
import { MotorcycleRestrictionStrategy } from './strategies/motorcycle-restriction.strategy.js';
import { EBikeRestrictionStrategy } from './strategies/ebike-restriction.strategy.js';
import { NoPendingDebitsRule } from './rules/no-pending-debits.rule.js';
import { NoActiveViolationsRule } from './rules/no-active-violations.rule.js';
import {
  VEHICLE_STRATEGIES,
  VehicleStrategyRegistry,
} from './strategies/vehicle-strategy.registry.js';
import { RentalsServiceStrategy } from './rentals-strategy.service.js';

@Module({
  imports: [CustomerModule, VehicleModule],
  controllers: [RentalsController],
  providers: [
    RentalsService,
    RentalsServiceStrategy,
    VehicleStrategyRegistry,
    NoPendingDebitsRule,
    NoActiveViolationsRule,
    CarRestrictionStrategy,
    MotorcycleRestrictionStrategy,
    EBikeRestrictionStrategy,
    {
      provide: VEHICLE_STRATEGIES,
      useFactory: (
        car: CarRestrictionStrategy,
        moto: MotorcycleRestrictionStrategy,
        ebike: EBikeRestrictionStrategy,
      ) => [car, moto, ebike],
      inject: [
        CarRestrictionStrategy,
        MotorcycleRestrictionStrategy,
        EBikeRestrictionStrategy,
      ],
    },
  ],
})
export class RentalsModule {}
