import { IsEmail, IsEnum, IsInt, IsNumber, IsOptional, IsString } from "class-validator";
import { PaymentStatus, PaymentType } from "@/common/enums";

export class CreateTicketDto {
  @IsInt()
  trip_id: number;

  @IsInt()
  customer_id: number;

  @IsString()
  @IsOptional()
  transaction_id?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  full_name?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsNumber()
  price: number;

  @IsEnum(PaymentStatus)
  @IsOptional()
  payment_status?: PaymentStatus;

  @IsEnum(PaymentType)
  @IsOptional()
  payment_type?: PaymentType;
}
