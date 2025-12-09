import { IsEnum, IsInt, IsOptional } from "class-validator";
import { TicketSeatStatus } from "@/common/enums";

export class CreateTicketSeatDto {
  @IsInt()
  ticket_id: number;

  @IsInt()
  seat_id: number;

  @IsEnum(TicketSeatStatus)
  @IsOptional()
  status?: TicketSeatStatus;
}
