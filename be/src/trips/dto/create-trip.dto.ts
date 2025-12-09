import { IsDateString, IsEnum, IsInt, IsNumber, IsOptional, IsString } from "class-validator";
import { TripStatus } from "@/common/enums";

export class CreateTripDto {
  @IsInt()
  company_id: number;

  @IsInt()
  car_id: number;

  @IsInt()
  driver_id: number;

  @IsString()
  trip_name: string;

  @IsInt()
  departure_location_id: number;

  @IsDateString()
  start_time: string;

  @IsInt()
  arrival_location_id: number;

  @IsDateString()
  end_time: string;

  @IsEnum(TripStatus)
  @IsOptional()
  status?: TripStatus;

  @IsNumber()
  @IsOptional()
  price?: number;
}
