import { Sex } from "@/common/enums";
import { IsDateString, IsEnum, IsOptional, IsString } from "class-validator";

export class BaseUserDto {
  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsString()
  phone?: string;

  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  url_img?: string;

  @IsOptional()
  @IsString()
  url_public_img?: string;

  @IsDateString()
  date_birth?: string;

  @IsEnum(Sex)
  sex?: Sex;
}
