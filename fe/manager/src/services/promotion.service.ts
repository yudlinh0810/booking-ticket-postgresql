import { ArrangeType } from "../types/type";
import { PromotionType } from "../types/promotion";
import { bookTicketAPI } from "./customize.service";

export const getPromotionList = async ({
  offset,
  limit,
  arrangeType,
  codeSearch,
  carTypes,
  type,
}: {
  offset: number;
  limit: number;
  arrangeType: ArrangeType;
  codeSearch: string;
  carTypes: string[];
  type: string;
}) => {
  try {
    const response = await bookTicketAPI.get<{ data: PromotionType[]; total: number }>(
      `/promotions?code=${codeSearch}&carTypes=${carTypes}&type=${type}&offset=${offset}&limit=${limit}&arrangeType=${arrangeType}`
    );
    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Lỗi khi lấy danh sách khuyến mãi");
  }
};

export const fetchPromotionByCode = async (code: string) => {
  try {
    const response = await bookTicketAPI.get<PromotionType>(`/promotions/code/${code}`);
    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Lỗi khi lấy khuyến mãi bằng mã");
  }
};

export const fetchPromotionById = async (id: string) => {
  try {
    const response = await bookTicketAPI.get<PromotionType>(`/promotions/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Lỗi khi lấy khuyến mãi bằng ID");
  }
};

export const updateInfoPromotion = async ({ id, data }: { id: number; data: object }) => {
  try {
    const response = await bookTicketAPI.put(`/promotions/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Lỗi khi cập nhật khuyến mãi");
  }
};

export const addPromotion = async (data: object) => {
  try {
    const response = await bookTicketAPI.post(`/promotions`, data);
    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Lỗi khi thêm khuyến mãi");
  }
};
