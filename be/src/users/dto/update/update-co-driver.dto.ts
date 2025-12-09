import { IsDateString, IsOptional } from "class-validator";
import { BaseUserDto } from "./base-user.dto";

export class UpdateCoDriverDto extends BaseUserDto {
  @IsOptional() @IsDateString() experience_years?: string;
}
