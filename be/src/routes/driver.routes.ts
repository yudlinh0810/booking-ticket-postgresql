import express from "express";

import { uploadImageToCloudinary } from "../middlewares/uploadHandler";
import { uploadImage } from "../middlewares/multerConfig";
import { UserController } from "../controllers/user.controller";
import { DriverController } from "../controllers/driver.controller";
import { verifyAccessToken } from "../services/auth.service";
import { authorizeRoles } from "../middlewares/auth.middleware";

const router = express.Router();
const driverController = new DriverController();
const userController = new UserController();

// Lấy danh sách tất cả
router.get("/", verifyAccessToken, authorizeRoles("admin"), driverController.getAll);
// Lấy chi tiết
router.get("/:id", verifyAccessToken, authorizeRoles("admin"), driverController.fetch);
// Tạo mới
router.post(
  "/",
  verifyAccessToken,
  authorizeRoles("admin"),
  uploadImage,
  uploadImageToCloudinary,
  driverController.create
);
// Cập nhật thông tin
router.put("/:id", verifyAccessToken, authorizeRoles("admin"), driverController.update);
// Cập nhật ảnh
router.put(
  "/:id/image",
  verifyAccessToken,
  authorizeRoles("admin"),
  uploadImage,
  uploadImageToCloudinary,
  driverController.updateImage
);
// Xóa
router.delete("/:id", verifyAccessToken, authorizeRoles("admin"), userController.delete);

export default router;
