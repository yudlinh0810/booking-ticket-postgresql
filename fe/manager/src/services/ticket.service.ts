import { ArrangeType } from "../types/type";
import { bookTicketAPI } from "./customize.service";
import {
  DataUpdateTicket,
  PaymentStatus,
  PaymentType,
  TicketBase,
  TicketInfo,
} from "../types/ticket";

export const getTickets = async ({
  offset,
  limit,
  arrangeType,
  transaction,
  phone,
  paymentStatus,
  paymentType,
}: {
  offset: number;
  limit: number;
  arrangeType: ArrangeType;
  transaction: string;
  phone: string;
  paymentStatus: PaymentStatus;
  paymentType: PaymentType;
}) => {
  try {
    const response = await bookTicketAPI.get<{ data: TicketBase[]; total: number }>(
      `/tickets?transaction=${transaction}&phone=${phone}&payment_status=${paymentStatus}&payment_type=${paymentType}&offset=${offset}&limit=${limit}&arrange_type=${arrangeType}`
    );
    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Lỗi khi lấy danh sách vé");
  }
};

export const fetchTicketById = async (id: string) => {
  try {
    const response = await bookTicketAPI.get<TicketInfo>(`/tickets/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Lỗi khi lấy chi tiết vé");
  }
};

export const updateTicket = async (dataUpdate: DataUpdateTicket) => {
  try {
    const response = await bookTicketAPI.put(`/tickets/${dataUpdate.id}`, dataUpdate);
    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Lỗi khi cập nhật vé");
  }
};

export const deleteTicket = async (id: number) => {
  try {
    const response = await bookTicketAPI.delete(`/tickets/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Lỗi khi xóa vé");
  }
};
