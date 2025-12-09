import { IsEnum, IsOptional } from "class-validator";
import { TicketSeatStatus } from "@/common/enums";

export class UpdateTicketSeatDto {
  @IsOptional() @IsEnum(TicketSeatStatus) status?: TicketSeatStatus;
}
