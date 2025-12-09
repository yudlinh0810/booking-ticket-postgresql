import { IsBoolean, IsOptional, IsString } from "class-validator";

export class UpdateImgCarDto {
  @IsOptional() @IsString() url_img?: string;
  @IsOptional() @IsString() url_public_img?: string;
  @IsOptional() @IsBoolean() is_main?: boolean;
  @IsOptional() @IsBoolean() is_deleted?: boolean;
}
