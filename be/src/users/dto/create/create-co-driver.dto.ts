import { IsInt, IsString } from "class-validator";
import { BaseUserDto } from "./base-user.dto";

export class CreateCoDriverDto extends BaseUserDto {
  @IsInt()
  company_id?: number;

  @IsString()
  license_number: string;
}
