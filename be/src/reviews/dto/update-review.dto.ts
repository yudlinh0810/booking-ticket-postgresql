import { IsInt, IsOptional, Max, Min, IsBoolean } from "class-validator";

export class UpdateReviewDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @IsOptional() @IsBoolean() is_deleted?: boolean;
}
