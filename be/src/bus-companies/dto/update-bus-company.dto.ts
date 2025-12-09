import { IsEmail, IsOptional, IsString, IsBoolean } from "class-validator";

export class UpdateBusCompanyDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsBoolean() is_deleted?: boolean;
}
