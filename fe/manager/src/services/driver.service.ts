import { DriverType } from "../types/driver";
import { ArrangeType, ImageType } from "../types/type";
import { bookTicketAPI } from "./customize.service";

export const getDriverList = async ({
  offset,
  limit,
  arrangeType,
}: {
  offset: number;
  limit: number;
  arrangeType: ArrangeType;
}) => {
  try {
    const response = await bookTicketAPI.get<{ data: DriverType[]; total: number }>(
      `/drivers?offset=${offset}&limit=${limit}&arrangeType=${arrangeType}`
    );
    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Lỗi khi lấy danh sách tài xế");
  }
};

export const fetchDriver = async (id: string) => {
  try {
    const response = await bookTicketAPI.get<DriverType>(`/drivers/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Lỗi khi lấy chi tiết tài xế");
  }
};

export const updateImgDriver = async (data: FormData) => {
  try {
    const response = await bookTicketAPI.put<ImageType>(`/drivers/image`, data);
    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Lỗi khi cập nhật ảnh tài xế");
  }
};

export const updateInfoDriver = async ({ id, data }: { id: number; data: object }) => {
  try {
    const response = await bookTicketAPI.put(`/drivers/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Lỗi khi cập nhật thông tin tài xế");
  }
};

export const addDriver = async (data: FormData) => {
  try {
    const response = await bookTicketAPI.post(`/drivers`, data);
    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Lỗi khi thêm tài xế");
  }
};

export const deleteDriver = async (id: number) => {
  try {
    const response = await bookTicketAPI.delete(`/drivers/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Lỗi khi xóa tài xế");
  }
};
