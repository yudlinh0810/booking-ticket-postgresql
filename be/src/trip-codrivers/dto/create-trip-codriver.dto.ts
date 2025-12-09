import { IsInt, IsOptional } from "class-validator";

export class CreateTripCodriverDto {
  @IsInt()
  @IsOptional()
  trip_id?: number;

  @IsInt()
  @IsOptional()
  co_driver_id?: number;
}
