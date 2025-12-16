import { UserStatus } from "@prisma/client";
import { UpdateBaseUserDto } from "./update-base-user.dto";
import { IsIn, IsOptional } from "class-validator";

const ALLOWED_ADMIN_STATUSES = Object.values(UserStatus).filter(
  (status) => status !== UserStatus.lock
);

export class UpdateAdminDto extends UpdateBaseUserDto {
  @IsOptional()
  @IsIn(ALLOWED_ADMIN_STATUSES, {
    message: `Status must be one of the following values: ${ALLOWED_ADMIN_STATUSES.join(", ")}`,
  })
  status?: UserStatus;
}
