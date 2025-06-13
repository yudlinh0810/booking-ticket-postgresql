export interface DataPaymentSuccess {
  id: number;
  customerId: number;
  email: string;
  fullName: string;
  phone: string;
  tripName: string;
  startTime: string;
  departure: string;
  arrival: string;
  seatPosition: string;
  paymentStatus: string;
  paymentMethod: string;
  price: number;
}
export type PaymentType = "cash" | "banking";
export type PaymentStatus = "paid" | "pending" | "failed" | "refunded";
