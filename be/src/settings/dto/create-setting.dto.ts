import { IsBoolean, IsEnum, IsInt, IsOptional, IsString } from "class-validator";
import { Theme } from "@/common/enums";

export class CreateSettingDto {
  @IsBoolean()
  @IsOptional()
  notification_enabled?: boolean;

  @IsEnum(Theme)
  @IsOptional()
  theme?: Theme;

  @IsString()
  @IsOptional()
  language?: string;
}
