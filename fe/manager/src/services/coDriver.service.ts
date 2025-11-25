import { CoDriverData } from "../types/coDriver";
import { ArrangeType, ImageType } from "../types/type";
import { bookTicketAPI } from "./customize.service";

export const getCoDriverList = async ({
  offset,
  limit,
  arrangeType,
}: {
  offset: number;
  limit: number;
  arrangeType: ArrangeType;
}) => {
  try {
    const response = await bookTicketAPI.get<{ data: CoDriverData[]; total: number }>(
      `/co-drivers?offset=${offset}&limit=${limit}&arrangeType=${arrangeType}`
    );
    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Lỗi khi lấy danh sách phụ xe");
  }
};

export const fetchCoDriver = async (id: string) => {
  try {
    const response = await bookTicketAPI.get<CoDriverData>(`/co-drivers/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Lỗi khi lấy chi tiết phụ xe");
  }
};

export const updateImgCoDriver = async (data: FormData) => {
  try {
    const response = await bookTicketAPI.put<ImageType>(`/co-drivers/image`, data);
    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Lỗi khi cập nhật ảnh phụ xe");
  }
};

export const updateInfoCoDriver = async ({ id, data }: { id: number; data: object }) => {
  try {
    const response = await bookTicketAPI.put(`/co-drivers/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Lỗi khi cập nhật thông tin phụ xe");
  }
};

export const addCoDriver = async (data: FormData) => {
  try {
    const response = await bookTicketAPI.post(`/co-drivers`, data);
    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Lỗi khi thêm phụ xe");
  }
};
