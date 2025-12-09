import { IsDateString, IsEnum, IsInt, IsOptional, IsString, IsBoolean } from "class-validator";
import { Role, UserStatus, Sex } from "@/common/enums";

export class UpdateUserByAdminDto {
  @IsOptional() @IsString() first_name?: string;
  @IsOptional() @IsString() last_name?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsDateString() date_birth?: string;

  // Thông tin nhạy cảm (Chỉ Admin mới được sửa) ---
  @IsOptional() @IsEnum(Role) role?: Role; // Admin có thể đổi Role (VD: từ Customer lên Driver), trừ admin và super-admin
  @IsOptional() @IsEnum(UserStatus) status?: UserStatus; // Khóa/Mở khóa tài khoản
  @IsOptional() @IsBoolean() is_deleted?: boolean; // Xóa mềm
  @IsOptional() @IsInt() company_id?: number; // Chuyển tài xế sang nhà xe khác

  @IsOptional() @IsString() license_number?: string;
  @IsOptional() @IsDateString() experience_years?: string;
}
