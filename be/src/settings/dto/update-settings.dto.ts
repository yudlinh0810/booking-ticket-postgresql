import { IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";
import { Theme } from "@/common/enums";

export class UpdateSettingDto {
  @IsOptional() @IsBoolean() notification_enabled?: boolean;
  @IsOptional() @IsEnum(Theme) theme?: Theme;
  @IsOptional() @IsString() language?: string;
}
