import { UserData } from "../types/user";
import { bookTicketAPI } from "./customizeAxios.service";

export const fetchUserDetail = async () => {
  try {
    const response = await bookTicketAPI.get<UserData>(`/users`).then((res) => res.data);
    return response;
  } catch (error) {
    throw new Error(error instanceof Error ? error?.message : "Lỗi khi lấy thông tin người dùng");
  }
};

export const addCustomer = async (data: FormData) => {
  try {
    const response = await bookTicketAPI.post(`/customers`, data);
    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error?.message : "Lỗi khi thêm khách hàng");
  }
};

export const updateCustomer = async (id: number, data: FormData) => {
  try {
    const response = await bookTicketAPI.put(`/customers/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error?.message : "Lỗi khi cập nhật khách hàng");
  }
};
