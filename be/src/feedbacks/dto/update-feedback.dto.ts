import { IsOptional, IsString, IsBoolean } from "class-validator";

export class UpdateFeedBackDto {
  @IsOptional() @IsString() content?: string;
  @IsOptional() @IsBoolean() is_deleted?: boolean;
}
