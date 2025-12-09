import { IsDateString, IsOptional, IsString } from "class-validator";
import { BaseUserDto } from "./base-user.dto";

export class UpdateDriverDto extends BaseUserDto {
  @IsOptional() @IsString() license_number?: string;
  @IsOptional() @IsDateString() experience_years?: string;
}
