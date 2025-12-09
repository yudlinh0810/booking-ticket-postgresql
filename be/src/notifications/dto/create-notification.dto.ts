import { IsEnum, IsInt, IsOptional, IsString } from "class-validator";
import { NotificationType } from "@/common/enums";

export class CreateNotificationDto {
  @IsInt()
  recipient_id: number;

  @IsEnum(NotificationType)
  type: NotificationType;

  @IsString()
  content: string;

  @IsString()
  @IsOptional()
  link_to?: string;
}
