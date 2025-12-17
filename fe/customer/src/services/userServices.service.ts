import { UserData } from "../types/user";
import { bookTicketAPI } from "./customizeAxios.service";

export const fetchUserDetail = async () => {
  try {
    const response = await bookTicketAPI
      .get<UserData>(`/customers/auth/profile`)
      .then((res) => res.data);
    return response;
  } catch (error) {
    throw new Error(error instanceof Error ? error?.message : "Lỗi khi lấy thông tin người dùng");
  }
};

export const updateUser = async (id: number, data: FormData) => {
  try {
    const response = await bookTicketAPI.put(`/auth/users/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error?.message : "Lỗi khi cập nhật khách hàng");
  }
};
