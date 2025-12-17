import { message } from "antd";
import { LoginPayLoad, RegisterPayLoad } from "../types";
import { bookTicketAPI } from "./customizeAxios.service";

export const loginWithGoogle = async (token: string) => {
  try {
    return await bookTicketAPI.post("/auth/google-login", { token }).then((res) => res.data);
  } catch (err) {
    message.error(err instanceof Error ? err.message : "Đăng nhập thất bại");
    return null;
  }
};

export const loginUser = async (data: LoginPayLoad) => {
  try {
    const response = await bookTicketAPI.post("/users/auth/customer/login", data);
    return response.data;
  } catch (err) {
    message.error(err instanceof Error ? err.message : "Đăng nhập thất bại");
    return null;
  }
};

export const register = async (data: RegisterPayLoad) => {
  try {
    const response = await bookTicketAPI.post("/customers", data);
    return response.data;
  } catch (err) {
    message.error(err instanceof Error ? err.message : "Đăng ký thất bại");
    return null;
  }
};

export const veriFyEmail = async (data: object) => {
  try {
    const response = await bookTicketAPI.post("/customers/verify-email", data);
    return response.data;
  } catch (err) {
    message.error(err instanceof Error ? err.message : "Xác thực email thất bại");
    return null;
  }
};

export const logoutCustomer = async () => {
  try {
    const response = await bookTicketAPI.post("/users/auth/logout");
    return response.data;
  } catch (err) {
    message.error(err instanceof Error ? err.message : "Đăng xuất thất bại");
    return null;
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const response = await bookTicketAPI.get("/customers/email", { data: email });
    return response.data;
  } catch (err) {
    message.error(err instanceof Error ? err.message : "Lấy thông tin người dùng thất bại");
    return null;
  }
};
