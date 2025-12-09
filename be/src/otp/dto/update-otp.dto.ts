import { IsOptional, IsString } from "class-validator";

export class UpdateOtpDto {
  @IsOptional() @IsString() otp?: string;
  @IsOptional() @IsString() password?: string;
}
