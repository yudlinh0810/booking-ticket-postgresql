export interface TicketInfo {
  id: number;
  transactionId?: string;
  trip: {
    id: number;
    name: string;
    departure: string;
    startTime: string;
    arrival: string;
    endTime: string;
    status: string;
  };
  customer: {
    id: number;
    fullName: string;
  };
  driver: {
    id: number;
    fullName: string;
  };
  coDriver: {
    id: number;
    fullName: string;
  }[];
  email: string;
  fullName: string;
  phone: string;
  seats: string;
  price: number;
  paymentType: PaymentType;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
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
    fullName: string;
  };
  email: string;
  fullName: string;
  phone: string;
  price: number;
  paymentType: PaymentType;
  paymentStatus: PaymentStatus;
}

export type PaymentType = "all" | "cash" | "banking";
export type PaymentStatus = "paid" | "pending" | "failed" | "refunded";
