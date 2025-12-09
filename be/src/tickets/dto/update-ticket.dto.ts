import { IsEmail, IsEnum, IsNumber, IsOptional, IsString, IsBoolean } from "class-validator";
import { PaymentStatus, PaymentType } from "@/common/enums";

export class UpdateTicketDto {
  // không update trip_id hay customer_id của vé đã đặt
  @IsOptional() @IsString() transaction_id?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() full_name?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsEnum(PaymentStatus) payment_status?: PaymentStatus;
  @IsOptional() @IsEnum(PaymentType) payment_type?: PaymentType;
  @IsOptional() @IsBoolean() is_deleted?: boolean;
}
