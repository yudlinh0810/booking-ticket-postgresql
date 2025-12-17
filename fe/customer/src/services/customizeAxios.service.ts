import axios from "axios";
import { toast } from "react-toastify";
import { useUserStore } from "../store/userStore";

// Định nghĩa kiểu cho các request bị lỗi đang chờ
type FailedRequest = {
  resolve: (value?: unknown) => void;
  reject: (error: unknown) => void;
};

let isRefreshing = false; // Cờ báo hiệu đang trong quá trình refresh
let failedQueue: FailedRequest[] = []; // Hàng đợi các request bị lỗi

// Hàm xử lý hàng đợi: gọi resolve (nếu thành công) hoặc reject (nếu thất bại) cho các request đang chờ
const processQueue = (error: unknown | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

// 1. Instance đặc biệt cho việc gọi API Refresh Token
const refreshAPI = axios.create({
  baseURL: `https://${import.meta.env.VITE_API_URL}.ngrok-free.app/api`,
  // baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
  headers: { "ngrok-skip-browser-warning": "true" },
});

// 2. Instance chính cho các API cần xác thực
export const bookTicketAPI = axios.create({
  baseURL: `https://${import.meta.env.VITE_API_URL}.ngrok-free.app/api`,
  // baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
  headers: { "ngrok-skip-browser-warning": "true" },
});

bookTicketAPI.interceptors.response.use(
  (response) => response.data || [],

  async (error) => {
    const originalRequest = error.config;
    const { logout } = useUserStore.getState();
    const status = error.response?.status;

    // Kiểm tra lỗi 401 (Unauthorized) và request chưa được thử lại
    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => bookTicketAPI(originalRequest)); // Gọi lại request gốc với token mới
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await refreshAPI.get("/users/auth/refresh-token");

        if (response.data.success !== true) {
          throw new Error("Server failed to refresh token or did not return success=true");
        }

        processQueue(null);

        return bookTicketAPI(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        console.error("Refresh token failed, session expired or server error:", refreshError);
        logout();
        toast.warning("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default bookTicketAPI;
