import { CustomerType } from "../types/customer";
import { ArrangeType, ImageType } from "../types/type";
import { bookTicketAPI } from "./customize.service";

export const getCustomerList = async ({
  offset,
  limit,
  arrangeType,
  emailSearch,
}: {
  offset: number;
  limit: number;
  arrangeType: ArrangeType;
  emailSearch: string;
}) => {
  try {
    const response = await bookTicketAPI.get<{ data: CustomerType[]; total: number }>(
      `/customers?email=${emailSearch}&offset=${offset}&limit=${limit}&arrangeType=${arrangeType}`
    );
    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Lỗi khi lấy danh sách khách hàng");
  }
};

export const fetchCustomer = async (id: string) => {
  try {
    const response = await bookTicketAPI.get<CustomerType>(`/customers/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Lỗi khi lấy chi tiết khách hàng");
  }
};

export const updateImgCustomer = async (data: FormData) => {
  try {
    const response = await bookTicketAPI.put<ImageType>(`/customers/image`, data);
    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Lỗi khi cập nhật ảnh khách hàng");
  }
};

export const updateInfoCustomer = async ({ id, data }: { id: number; data: object }) => {
  try {
    const response = await bookTicketAPI.put(`/customers/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Lỗi khi cập nhật thông tin khách hàng"
    );
  }
};

export const addCustomer = async (data: FormData) => {
  try {
    const response = await bookTicketAPI.post(`/customers`, data);
    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Lỗi khi thêm khách hàng");
  }
};
