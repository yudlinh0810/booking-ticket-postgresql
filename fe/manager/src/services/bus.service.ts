import { BusType } from "../types/bus";
import { ArrangeType } from "../types/type";
import { bookTicketAPI } from "./customize.service";

export const getBusList = async ({
  offset,
  limit,
  arrangeType,
  licensePlateSearch,
  type,
}: {
  offset: number;
  limit: number;
  arrangeType: ArrangeType;
  licensePlateSearch: string;
  type: "xe-thuong" | "xe-giuong-nam" | "all";
}) => {
  try {
    const response = await bookTicketAPI.get<{ data: BusType[]; total: number; totalPage: number }>(
      `/cars?license_plate=${licensePlateSearch}&type=${type}&offset=${offset}&limit=${limit}&arrangeType=${arrangeType}`
    );
    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Lỗi khi lấy danh sách xe");
  }
};

export const addBus = async (data: FormData) => {
  try {
    const response = await bookTicketAPI.post(`/cars`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Lỗi khi thêm xe");
  }
};

export const getDetailBus = async (licensePlate: string) => {
  try {
    const response = await bookTicketAPI.get<BusType>(`/cars/license-plate/${licensePlate}`, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Lỗi khi lấy chi tiết xe");
  }
};

export const updateBus = async (data: FormData) => {
  try {
    const response = await bookTicketAPI.put(`/cars`, data);
    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Lỗi khi cập nhật xe");
  }
};

export const deleteBus = async (licensePlate: number) => {
  try {
    const response = await bookTicketAPI.delete(`/cars/${licensePlate}`);
    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Lỗi khi xóa xe");
  }
};

export const addImgsBus = async (data: FormData) => {
  try {
    const response = await bookTicketAPI.post(`/cars/images`, data);
    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Lỗi khi thêm ảnh xe");
  }
};

export const updateImgBus = async (data: FormData): Promise<object> => {
  try {
    const response = await bookTicketAPI.put(`/cars/image`, data);
    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Lỗi khi cập nhật ảnh xe");
  }
};

export const deleteImgBus = async (data: object) => {
  try {
    const response = await bookTicketAPI.delete(`/cars/image`, { data });
    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Lỗi khi xóa ảnh xe");
  }
};
