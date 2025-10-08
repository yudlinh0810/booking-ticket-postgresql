import { UserData } from "../types/user";
import { bookTicketAPI } from "./customizeAxios.service";

export const fetchUser = async () => {
  try {
    const response = await bookTicketAPI.get<UserData>(`/user/detail/`).then((res) => res.data);
    console.log("response", response);
    return response;
  } catch (error) {
    throw new Error(error instanceof Error ? error?.message : "Lỗi khi lấy thông tin người dùng");
  }
};

export const addCustomer = async (data: FormData) => {
  try {
    const response = await bookTicketAPI.post(`/customer/add`, data);
    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error?.message : "Lỗi khi thêm khách hàng");
  }
};

export const updateCustomer = async (id: number, data: FormData) => {
  try {
    const response = await bookTicketAPI.put(`/customer/update/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error?.message : "Lỗi khi cập nhật khách hàng");
  }
};
