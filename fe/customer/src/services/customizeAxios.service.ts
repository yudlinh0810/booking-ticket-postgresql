import axios from "axios";
import { toast } from "react-toastify";

type FailedRequest = {
  resolve: (value?: unknown) => void;
  reject: (error: unknown) => void;
};

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: unknown) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve();
  });
  failedQueue = [];
};

// Tạo instance riêng cho refresh token (không có interceptor)
const refreshAPI = axios.create({
  baseURL: `https://${import.meta.env.VITE_API_URL}.ngrok-free.app/api`,
  withCredentials: true,
  headers: { "ngrok-skip-browser-warning": "true" },
});

export const bookTicketAPI = axios.create({
  baseURL: `https://${import.meta.env.VITE_API_URL}.ngrok-free.app/api`,
  withCredentials: true,
  headers: { "ngrok-skip-browser-warning": "true" },
});

bookTicketAPI.interceptors.response.use(
  (response) => response.data || [],
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => bookTicketAPI(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await refreshAPI.get("/user/auth/refresh-token");

        if (response.data.success !== true) throw new Error("Failed to refresh token");

        processQueue(null);
        return bookTicketAPI(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        toast.warning("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
