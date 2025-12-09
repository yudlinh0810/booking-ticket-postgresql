import { Sex } from "@/common/enums";
import { IsDateString, IsEnum, IsOptional, IsString } from "class-validator";

export class BaseUserDto {
  @IsOptional() @IsString() first_name?: string;
  @IsOptional() @IsString() last_name?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsString() url_img?: string;
  @IsOptional() @IsString() url_public_img?: string;
  @IsOptional() @IsDateString() date_birth?: string;
  @IsOptional() @IsEnum(Sex) sex?: Sex;
}
