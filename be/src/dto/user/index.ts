import { Role } from "@prisma/client";
import { UpdateCustomerDTO } from "./customer.dto";
import { UpdateDriverDTO } from "./driver.dto";
import { UpdateManagerDTO } from "./manager.dto";
import { UpdateAdminDTO } from "./admin.dto";
import { UpdateCoDriverDTO } from "./co_driver.dto";

export type UpdateUserMapper = {
  customer: UpdateCustomerDTO;
  driver: UpdateDriverDTO;
  co_driver: UpdateCoDriverDTO;
  manager: UpdateManagerDTO;
  admin: UpdateAdminDTO;
};

export type UpdateUserDTOByRole<T extends Role> = UpdateUserMapper[T];
