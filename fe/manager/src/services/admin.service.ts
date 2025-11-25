import { AdminType } from "../types/admin";
import { ArrangeType } from "../types/type";
import { bookTicketAPI } from "./customize.service";

export const getAdminList = async ({
  offset,
  limit,
  arrangeType,
}: {
  offset: number;
  limit: number;
  arrangeType: ArrangeType;
}) => {
  try {
    const response = await bookTicketAPI.get<{ data: AdminType[]; total: number }>(
      `/admins?offset=${offset}&limit=${limit}&arrangeType=${arrangeType}`
    );
    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Lỗi khi lấy danh sách admin");
  }
};

export const fetchAdmin = async (id: string) => {
  try {
    const response = await bookTicketAPI.get<AdminType>(`/admins/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Lỗi khi lấy chi tiết admin");
  }
};

export const updateInfoAdmin = async ({ id, data }: { id: number; data: object }) => {
  try {
    const response = await bookTicketAPI.put(`/admins/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Lỗi khi cập nhật admin");
  }
};

export const addAdmin = async (data: { email: string; fullName: string; password: string }) => {
  try {
    const response = await bookTicketAPI.post(`/admins`, data);
    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Lỗi khi thêm admin");
  }
};
