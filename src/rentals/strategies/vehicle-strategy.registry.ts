import { Inject, Injectable, BadRequestException } from '@nestjs/common';

import { VehicleType } from '../../vehicle/enum/vehicle-type.enum.js';
import { VehicleRestrictionStrategy } from './vehicle-restriction.strategy.js';

export const VEHICLE_STRATEGIES = 'VEHICLE_STRATEGIES';

@Injectable()
export class VehicleStrategyRegistry {
  private readonly strategiesMap = new Map<
    VehicleType,
    VehicleRestrictionStrategy
  >();

  constructor(
    @Inject(VEHICLE_STRATEGIES)
    strategies: VehicleRestrictionStrategy[],
  ) {
    strategies.forEach((strategy) => {
      this.strategiesMap.set(strategy.vehicleType, strategy);
    });
  }

  getStrategy(vehicleType: VehicleType): VehicleRestrictionStrategy {
    const strategy = this.strategiesMap.get(vehicleType);

    if (!strategy) {
      throw new BadRequestException(
        `Unsupported vehicle type: "${vehicleType}".`,
      );
    }

    return strategy;
  }
}
