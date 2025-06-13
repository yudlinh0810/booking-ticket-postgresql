import { ArrangeType } from "../types/type";
import { bookTicketAPI } from "./customize.service";
import { PaymentStatus, PaymentType, TicketBase, TicketInfo } from "../types/ticket";

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
  return await bookTicketAPI
    .get<{ data: TicketBase[]; total: number }>(
      `/ticket/get-all?transaction=${transaction}&phone=${phone}&payment_status=${paymentStatus}&payment_type=${paymentType}&offset=${offset}&limit=${limit}&arrange_type=${arrangeType}`
    )
    .then((res) => res.data);
};

export const fetchPromotionById = async (id: number) => {
  return await bookTicketAPI
    .get<TicketInfo>(`/promotion/get-detail-by-code/${id}`)
    .then((res) => res.data);
};

export const updatePaymentStatusTicket = async ({
  id,
  paymentStatus,
}: {
  id: number;
  paymentStatus: PaymentStatus;
}) => {
  return await bookTicketAPI.put(`/promotion/update/${id}`, paymentStatus).then((res) => res.data);
};

export const deleteTicket = async (id: number) => {
  return await bookTicketAPI.delete(`/ticket/delete/${id}`).then((res) => res.data);
};
