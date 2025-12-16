import express from "express";
import { authorizeRoles } from "@/middlewares/auth.middleware";
import PromotionController from "@/controllers/promotion.controller";
import { AuthService } from "@/services/auth.service";

const router = express.Router();
const promotionController = new PromotionController();
const authService = new AuthService();

// Tạo mới
router.post(
  "/",
  authService.verifyAccessToken,
  authorizeRoles("admin"),
  promotionController.create
);
// Cập nhật
router.put(
  "/:id",
  authService.verifyAccessToken,
  authorizeRoles("admin"),
  promotionController.update
);
// Lấy danh sách tất cả
router.get("/", authService.verifyAccessToken, authorizeRoles("admin"), promotionController.getAll);
// Lấy chi tiết bằng mã (code)
router.get(
  "/code/:code",
  authService.verifyAccessToken,
  authorizeRoles("admin"),
  promotionController.fetchByCode
);
// Lấy chi tiết bằng ID
router.get(
  "/:id",
  authService.verifyAccessToken,
  authorizeRoles("admin"),
  promotionController.fetchById
);
// Xóa bằng mã (code)
router.delete(
  "/code/:code",
  authService.verifyAccessToken,
  authorizeRoles("admin"),
  promotionController.delete
);

export default router;
