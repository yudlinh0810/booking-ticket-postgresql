import { UpdateDriverDTO } from "./driver.dto";

export type UpdateCoDriverDTO = Partial<
  Pick<
    UpdateDriverDTO,
    | "first_name"
    | "last_name"
    | "phone"
    | "address"
    | "date_birth"
    | "sex"
    | "url_img"
    | "url_public_img"
    | "license_number"
    | "Location"
    | "BusCompany"
  >
>;
