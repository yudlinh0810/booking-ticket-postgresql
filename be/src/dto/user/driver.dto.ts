import { Prisma } from "@prisma/client";

export type UpdateDriverDTO = Partial<
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
    | "license_number"
    | "experience_years"
    | "Location"
    | "BusCompany"
  >
>;
