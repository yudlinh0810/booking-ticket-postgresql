import { Prisma } from "@prisma/client";

export type UpdateAdminDTO = Partial<
  Pick<
    Prisma.UserUpdateInput,
    | "first_name"
    | "last_name"
    | "phone"
    | "address"
    | "date_birth"
    | "sex"
    | "url_img"
    | "url_public_img"
    | "status"
    | "role" // admin có thể đổi role người khác
  >
>;
