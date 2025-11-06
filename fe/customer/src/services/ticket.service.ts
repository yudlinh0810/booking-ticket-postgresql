import { toast } from "react-toastify";
import { FormDataTicket } from "../pages/BookedPage";
import { bookTicketAPI } from "./customizeAxios.service";

export const createTicket = async (formData: FormDataTicket) => {
  try {
    const response = await bookTicketAPI.post("/tickets", formData);
    return response.data;
  } catch (err) {
    toast.warning(err instanceof Error ? err.message : "Lỗi khi tạo vé");
    return null;
  }
};

export const getDetailTicket = async (data: object) => {
  try {
    const response = await bookTicketAPI.get("/tickets/detail", { data });
    return response.data;
  } catch (err) {
    toast.warning(err instanceof Error ? err.message : "Lỗi khi lấy chi tiết vé");
    return null;
  }
};

export const getDetailTicketByEmail = async (email: string) => {
  try {
    const response = await bookTicketAPI.get("/tickets/email", { data: email });
    return response.data;
  } catch (err) {
    toast.warning(err instanceof Error ? err.message : "Lỗi khi lấy vé theo email");
    return null;
  }
};

export const deleteTicket = async (id: number) => {
  try {
    const response = await bookTicketAPI.delete(`/tickets/${id}`);
    return response.data;
  } catch (err) {
    toast.warning(err instanceof Error ? err.message : "Lỗi khi xoá vé");
    return null;
  }
};
