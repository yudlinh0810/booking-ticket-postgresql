import { IsBoolean, IsInt, IsOptional, IsString } from "class-validator";

export class CreateImgCarDto {
  @IsInt()
  car_id: number;

  @IsString()
  url_img: string;

  @IsString()
  url_public_img: string;

  @IsBoolean()
  @IsOptional()
  is_main?: boolean;
}
