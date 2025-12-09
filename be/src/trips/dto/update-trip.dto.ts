import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsBoolean,
} from "class-validator";
import { TripStatus } from "@/common/enums";

export class UpdateTripDto {
  @IsOptional() @IsInt() driver_id?: number; // Đổi tài xế
  @IsOptional() @IsInt() car_id?: number; // Đổi xe
  @IsOptional() @IsString() trip_name?: string;
  @IsOptional() @IsInt() departure_location_id?: number;
  @IsOptional() @IsDateString() start_time?: string;
  @IsOptional() @IsInt() arrival_location_id?: number;
  @IsOptional() @IsDateString() end_time?: string;
  @IsOptional() @IsEnum(TripStatus) status?: TripStatus; // Cập nhật trạng thái chuyến đi(khi chưa chạy và chưa bán vé)
  @IsOptional() @IsNumber() price?: number;
  @IsOptional() @IsBoolean() is_deleted?: boolean;
}
