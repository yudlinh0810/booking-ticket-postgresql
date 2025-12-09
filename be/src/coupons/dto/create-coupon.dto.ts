import { IsDateString, IsEnum, IsInt, IsNumber, IsOptional, IsString } from "class-validator";
import { CarType, CouponType, CouponStatus } from "@/common/enums";

export class CreateCouponDto {
  @IsInt()
  @IsOptional()
  company_id?: number;

  @IsString()
  @IsOptional()
  code?: string;

  @IsEnum(CarType)
  car_type: CarType;

  @IsEnum(CouponType)
  type: CouponType;

  @IsEnum(CouponStatus)
  @IsOptional()
  status?: CouponStatus;

  @IsNumber()
  @IsOptional()
  coupon_amount?: number;

  @IsString()
  description: string;

  @IsString()
  url_img: string;

  @IsString()
  url_public_img: string;

  @IsDateString()
  @IsOptional()
  start_date?: string;

  @IsDateString()
  @IsOptional()
  end_date?: string;
}
