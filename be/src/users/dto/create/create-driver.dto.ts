import { IsDateString, IsEnum, IsInt, IsString } from "class-validator";
import { CreateBaseUserDto } from "./create-base-user.dto";

export class CreateDriverDto extends CreateBaseUserDto {
  @IsInt()
  company_id: number;

  @IsString()
  license_number: string;

  @IsDateString()
  start_work_date: string;
}
