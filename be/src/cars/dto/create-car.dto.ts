import { IsEnum, IsInt, IsOptional, IsString } from "class-validator";
import { CarType, CarStatus } from "@/common/enums";

export class CreateCarDto {
  @IsInt()
  @IsOptional()
  current_location_id?: number;

  @IsInt()
  company_id: number;

  @IsString()
  license_plate: string;

  @IsInt()
  capacity: number;

  @IsEnum(CarType)
  @IsOptional()
  type?: CarType;

  @IsEnum(CarStatus)
  @IsOptional()
  status?: CarStatus;
}
