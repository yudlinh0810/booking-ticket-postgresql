import { IsEnum, IsInt, IsOptional, IsString } from "class-validator";
import { SeatFloor, SeatStatus } from "@/common/enums";

export class CreateSeatDto {
  @IsInt()
  @IsOptional()
  trip_id?: number;

  @IsString()
  @IsOptional()
  seat_number?: string;

  @IsEnum(SeatFloor)
  @IsOptional()
  floor?: SeatFloor;

  @IsEnum(SeatStatus)
  @IsOptional()
  status?: SeatStatus;
}
