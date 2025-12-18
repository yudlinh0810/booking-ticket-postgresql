import { payOSController } from "@/controllers";
import { authorizeRoles } from "@/middlewares/auth.middleware";
import { authService } from "@/services";
import express from "express";

const payOSrouter = express.Router();

// Tạo thanh toán
payOSrouter.post(
  "/",
  authService.verifyAccessToken,
  authorizeRoles("admin", "customer"),
  payOSController.createPayment
);
// Lấy link thanh toán
payOSrouter.post(
  "/link",
  authService.verifyAccessToken,
  authorizeRoles("admin", "customer"),
  payOSController.getPaymentLink
);
payOSrouter.put(
  "/link/cancel",
  authService.verifyAccessToken,
  authorizeRoles("admin", "customer"),
  payOSController.cancelPayment
);

export default payOSrouter;
