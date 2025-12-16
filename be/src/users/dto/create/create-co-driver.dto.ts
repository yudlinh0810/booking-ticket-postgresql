import { IsDateString, IsInt, IsString } from "class-validator";
import { CreateBaseUserDto } from "./create-base-user.dto";

export class CreateCoDriverDto extends CreateBaseUserDto {
  @IsInt()
  company_id?: number;

  @IsDateString()
  start_work_date?: string;
}
