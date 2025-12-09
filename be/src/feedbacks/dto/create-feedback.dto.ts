import { IsInt, IsOptional, IsString } from "class-validator";

export class CreateFeedBackDto {
  @IsInt()
  customer_id: number;

  @IsInt()
  trip_id: number;

  @IsString()
  @IsOptional()
  content?: string;
}
