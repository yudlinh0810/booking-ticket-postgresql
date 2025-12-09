import { UserStatus } from "@prisma/client";
import { BaseUserDto } from "./base-user.dto";
import { IsEnum, IsOptional } from "class-validator";

export class UpdateAdminDto extends BaseUserDto {
  @IsOptional() @IsEnum(UserStatus) status?: UserStatus;
}
