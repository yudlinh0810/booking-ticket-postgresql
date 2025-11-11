import express from "express";
import { verifyAccessToken } from "../services/auth.service";
import { authorizeRoles } from "../middlewares/auth.middleware";
import PromotionController from "../controllers/promotion.controller";

const router = express.Router();
const promotionController = new PromotionController();

// Tạo mới
router.post("/", verifyAccessToken, authorizeRoles("admin"), promotionController.create);
// Cập nhật
router.put("/:id", verifyAccessToken, authorizeRoles("admin"), promotionController.update);
// Lấy danh sách tất cả
router.get("/", verifyAccessToken, authorizeRoles("admin"), promotionController.getAll);
// Lấy chi tiết bằng mã (code)
router.get(
  "/code/:code",
  verifyAccessToken,
  authorizeRoles("admin"),
  promotionController.fetchByCode
);
// Lấy chi tiết bằng ID
router.get("/:id", verifyAccessToken, authorizeRoles("admin"), promotionController.fetchById);
// Xóa bằng mã (code)
router.delete(
  "/code/:code",
  verifyAccessToken,
  authorizeRoles("admin"),
  promotionController.delete
);

export default router;
