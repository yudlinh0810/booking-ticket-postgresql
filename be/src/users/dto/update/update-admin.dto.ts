import { Role, UserStatus } from "@prisma/client";
import { BaseUserDto } from "./base-user.dto";
import { IsBoolean, IsEnum, IsInt, IsOptional } from "class-validator";

export class UpdateAdminDto extends BaseUserDto {
  @IsOptional() @IsEnum(UserStatus) status?: UserStatus;
}
