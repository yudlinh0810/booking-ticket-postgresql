export interface TicketInfo {
  id: number;
  transactionId?: string;
  trip: {
    id: number;
    name: string;
  };
  buyer: {
    id: number;
    email: string;
    fullName: string;
    phone: string;
  };
  receiver: {
    email: string;
    fullName: string;
    phone: string;
  };
  seats: string;
  price: number;
  paymentType: PaymentType;
  paymentStatus: PaymentStatus;
  createAt: string;
  updateAt: string;
}

export interface TicketBase {
  id: number;
  transactionId?: string;
  trip: {
    id: number;
    name: string;
  };
  customer: {
    id: number;
    email: string;
    fullName: string;
  };
  email: string;
  fullName: string;
  phone: string;
  price: number;
  paymentType: PaymentType;
  paymentStatus: PaymentStatus;
}

export interface DataUpdateTicket {
  id: number;
  transactionId?: string;
  paymentType?: PaymentType;
  paymentStatus?: PaymentStatus;
}

export type PaymentType = "all" | "cash" | "banking";
export type PaymentStatus = "paid" | "pending" | "failed" | "refunded" | "all";

export const paymentStatusMap: Record<PaymentStatus, string> = {
  all: "Tất cả",
  paid: "Đã thanh toán",
  pending: "Đang xử lý",
  failed: "Thất bại",
  refunded: "Đã hoàn tiền",
};
export const paymentTypeMap: Record<PaymentType, string> = {
  all: "Tất cả",
  cash: "Tiền mặt",
  banking: "Ngân hàng",
};
