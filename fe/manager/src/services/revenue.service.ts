import { HourlyRevenue, MonthRevenue, YearRevenue } from "../types/revenue";
import { bookTicketAPI } from "./customize.service";

export const getRevenueHour = async (period: string) => {
  try {
    const response = await bookTicketAPI.get<HourlyRevenue[]>(`/revenues/hourly?period=${period}`);
    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Lỗi khi lấy doanh thu theo giờ");
  }
};

export const getRevenueMonth = async (period: string) => {
  try {
    const response = await bookTicketAPI.get<MonthRevenue[]>(`/revenues/monthly?period=${period}`);
    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Lỗi khi lấy doanh thu theo tháng");
  }
};

export const getRevenueYear = async (period: string) => {
  try {
    const response = await bookTicketAPI.get<YearRevenue[]>(`/revenues/yearly?period=${period}`);
    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Lỗi khi lấy doanh thu theo năm");
  }
};
