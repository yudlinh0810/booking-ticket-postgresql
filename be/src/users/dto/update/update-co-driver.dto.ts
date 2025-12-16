import { IsDateString, IsOptional } from "class-validator";
import { UpdateBaseUserDto } from "./update-base-user.dto";

export class UpdateCoDriverDto extends UpdateBaseUserDto {
  @IsOptional() @IsDateString() start_work_date?: string;
}
