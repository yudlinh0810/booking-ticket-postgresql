import { DashboardStats } from "../types/statistical";
import { bookTicketAPI } from "./customize.service";

export const getDashboardStats = async () => {
  try {
    const response = await bookTicketAPI.get<DashboardStats>(`/statisticals`);
    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Lỗi khi lấy dữ liệu thống kê");
  }
};
