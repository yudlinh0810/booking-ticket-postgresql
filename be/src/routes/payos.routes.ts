import express from "express";
import { authorizeRoles } from "@/middlewares/auth.middleware";
import payosController from "@/controllers/payos.controller";
import { AuthService } from "@/services/auth.service";
const router = express.Router();
const authService = new AuthService();

// Tạo thanh toán
router.post(
  "/",
  authService.verifyAccessToken,
  authorizeRoles("admin", "customer"),
  payosController.createPayment
);
// Lấy link thanh toán
router.post(
  "/link",
  authService.verifyAccessToken,
  authorizeRoles("admin", "customer"),
  payosController.getPaymentLink
);
router.put(
  "/link/cancel",
  authService.verifyAccessToken,
  authorizeRoles("admin", "customer"),
  payosController.cancelPayment
);

export default router;
