import { IsEmail, IsOptional, IsString } from "class-validator";

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  first_name: string;

  @IsOptional()
  @IsString()
  last_name: string;

  /** Case register with google, ... **/

  @IsOptional()
  @IsString()
  url_img?: string;

  @IsOptional()
  @IsString()
  url_public_img?: string;
}
