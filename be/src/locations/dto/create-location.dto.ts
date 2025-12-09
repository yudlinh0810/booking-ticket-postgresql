import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateLocationDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;
}
