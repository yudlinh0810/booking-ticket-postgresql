import { bookTicketAPI } from "../services/customize.service";

function refreshAccessToken() {
  bookTicketAPI.get(`/user/auth/refresh-token`, { withCredentials: true });
}

export function handleTokenExpiration() {
  const expirationStr = localStorage.getItem("expirationTime");

  if (!expirationStr) return;

  const expiration = parseInt(expirationStr, 10);
  const timeToExpire = expiration - Date.now();
  console.log("timeToExpire", timeToExpire);

  if (timeToExpire < 0) {
    // Đã hết hạn, gọi refresh ngay
    refreshAccessToken();
  } else {
    // Còn thời gian, setup gọi tự động trước khi hết hạn
    setTimeout(() => {
      refreshAccessToken();
    }, timeToExpire);
  }
}
