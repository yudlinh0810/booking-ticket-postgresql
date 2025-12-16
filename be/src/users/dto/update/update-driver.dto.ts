import { IsDateString, IsOptional, IsString } from "class-validator";
import { UpdateBaseUserDto } from "./update-base-user.dto";

export class UpdateDriverDto extends UpdateBaseUserDto {
  @IsOptional() @IsString() license_number?: string;
  @IsOptional() @IsDateString() start_work_date?: string;
}
