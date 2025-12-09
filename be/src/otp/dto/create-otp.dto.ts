import { IsEmail, IsOptional, IsString, IsEnum } from "class-validator";
import { Role } from "@/common/enums";

export class CreateOtpDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  otp?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  full_name?: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
