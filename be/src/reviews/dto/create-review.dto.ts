import { IsInt, IsOptional, Max, Min } from "class-validator";

export class CreateReviewDto {
  @IsInt()
  customer_id: number;

  @IsInt()
  trip_id: number;

  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating?: number;
}
