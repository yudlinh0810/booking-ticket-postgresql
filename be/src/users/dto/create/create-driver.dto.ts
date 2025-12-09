import { IsDateString, IsEnum, IsInt, IsString } from "class-validator";
import { BaseUserDto } from "./base-user.dto";
import { Sex } from "@/common/enums";

export class CreateCoDriverDto extends BaseUserDto {
  @IsInt()
  company_id?: number;

  @IsString()
  license_number: string;

  @IsString()
  experience_years?: string;
}
