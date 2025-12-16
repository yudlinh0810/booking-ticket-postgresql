import { Role, UserStatus } from "@prisma/client";
import { UpdateBaseUserDto } from "./update-base-user.dto";
import { IsBoolean, IsEnum, IsOptional } from "class-validator";

export class UpdateSuperAdminDto extends UpdateBaseUserDto {
  @IsOptional() @IsEnum(UserStatus) status?: UserStatus;
  @IsOptional() @IsEnum(Role) role?: Role;
  @IsOptional() @IsBoolean() is_deleted?: boolean;
}
