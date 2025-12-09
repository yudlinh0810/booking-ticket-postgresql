import { IsNumber, IsOptional, IsString, IsBoolean } from "class-validator";

export class UpdateLocationDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsNumber() latitude?: number;
  @IsOptional() @IsNumber() longitude?: number;
  @IsOptional() @IsBoolean() is_deleted?: boolean;
}
