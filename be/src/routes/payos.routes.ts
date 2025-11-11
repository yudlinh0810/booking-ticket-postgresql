import express from "express";
import { verifyAccessToken } from "../services/auth.service";
import { authorizeRoles } from "../middlewares/auth.middleware";
import payosController from "../controllers/payos.controller";
const router = express.Router();

// Tạo thanh toán
router.post(
  "/",
  verifyAccessToken,
  authorizeRoles("admin", "customer"),
  payosController.createPayment
);
// Lấy link thanh toán
router.post(
  "/link",
  verifyAccessToken,
  authorizeRoles("admin", "customer"),
  payosController.getPaymentLink
);
router.put(
  "/link/cancel",
  verifyAccessToken,
  authorizeRoles("admin", "customer"),
  payosController.cancelPayment
);

export default router;
