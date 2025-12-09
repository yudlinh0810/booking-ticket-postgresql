import { IsEnum, IsOptional, IsString } from "class-validator";
import { SeatStatus } from "@/common/enums";

export class UpdateSeatDto {
  @IsOptional() @IsString() seat_number?: string;
  @IsOptional() @IsEnum(SeatStatus) status?: SeatStatus;
}
