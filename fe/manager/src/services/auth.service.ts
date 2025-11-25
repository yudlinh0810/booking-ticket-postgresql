import { LoginType } from "../types/type";
import { bookTicketAPI } from "./customize.service";

export const login = async (data: LoginType) => {
  try {
    const response = await bookTicketAPI.post("/user/auth/admin/login", data);
    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Đăng nhập admin thất bại");
  }
};

export const logout = async () => {
  try {
    const response = await bookTicketAPI.post("/user/auth/logout");
    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Đăng xuất thất bại");
  }
};
