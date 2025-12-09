import { IsEnum, IsInt, IsOptional, IsString, IsBoolean } from "class-validator";
import { CarType, CarStatus } from "@/common/enums";

export class UpdateCarDto {
  @IsOptional() @IsInt() current_location_id?: number;
  @IsOptional() @IsInt() company_id?: number;
  @IsOptional() @IsString() license_plate?: string;
  @IsOptional() @IsInt() capacity?: number;
  @IsOptional() @IsEnum(CarType) type?: CarType;
  @IsOptional() @IsEnum(CarStatus) status?: CarStatus;
  @IsOptional() @IsBoolean() is_deleted?: boolean;
}
