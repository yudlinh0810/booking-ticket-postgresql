import express from "express";
import { CoDriverController } from "@/controllers/coDriver.controller";
import { authorizeRoles } from "@/middlewares/auth.middleware";
import { uploadImage } from "@/middlewares/multerConfig";
import { uploadImageToCloudinary } from "@/middlewares/uploadHandler";
import { AuthService } from "@/services/auth.service";

const route = express.Router();
const coDriverController = new CoDriverController();
const authService = new AuthService();

// Tạo mới
route.post(
  "/",
  authService.verifyAccessToken,
  authorizeRoles("admin"),
  uploadImage,
  uploadImageToCloudinary,
  coDriverController.create
);
// Cập nhật thông tin
route.put(
  "/:id",
  authService.verifyAccessToken,
  authorizeRoles("admin"),
  coDriverController.update
);
// Cập nhật ảnh
route.put(
  "/:id/image",
  authService.verifyAccessToken,
  authorizeRoles("admin"),
  uploadImage,
  uploadImageToCloudinary,
  coDriverController.updateImage
);
// Lấy danh sách tất cả
route.get(
  "/",
  // authService.verifyAccessToken, authorizeRoles("admin"),
  coDriverController.getAll
);
// Lấy chi tiết
route.get(
  "/:id",
  // authService.verifyAccessToken, authorizeRoles("admin"),
  coDriverController.fetch
);

export default route;
