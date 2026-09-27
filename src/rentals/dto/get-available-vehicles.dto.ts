import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { VehicleType } from '../../vehicle/enum/vehicle-type.enum.js';

export class GetAvailableVehiclesDto {
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @IsEnum(VehicleType)
  @IsNotEmpty()
  vehicleType: VehicleType;
}
