import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, IsBoolean } from "class-validator";
import { CarType, CouponType, CouponStatus } from "@/common/enums";

export class UpdateCouponDto {
  @IsOptional() @IsString() code?: string;
  @IsOptional() @IsEnum(CarType) car_type?: CarType;
  @IsOptional() @IsEnum(CouponType) type?: CouponType;
  @IsOptional() @IsEnum(CouponStatus) status?: CouponStatus;
  @IsOptional() @IsNumber() coupon_amount?: number;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() url_img?: string;
  @IsOptional() @IsDateString() start_date?: string;
  @IsOptional() @IsDateString() end_date?: string;
  @IsOptional() @IsBoolean() is_deleted?: boolean;
}
