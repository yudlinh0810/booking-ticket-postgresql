import express from "express";
import { CoDriverController } from "../controllers/coDriver.controller";
import { verifyAccessToken } from "../services/auth.service";
import { authorizeRoles } from "../middlewares/auth.middleware";
import { uploadImage } from "../middlewares/multerConfig";
import { uploadImageToCloudinary } from "../middlewares/uploadHandler";

const route = express.Router();
const coDriverController = new CoDriverController();

// Tạo mới
route.post(
  "/",
  verifyAccessToken,
  authorizeRoles("admin"),
  uploadImage,
  uploadImageToCloudinary,
  coDriverController.create
);
// Cập nhật thông tin
route.put("/:id", verifyAccessToken, authorizeRoles("admin"), coDriverController.update);
// Cập nhật ảnh
route.put(
  "/:id/image",
  verifyAccessToken,
  authorizeRoles("admin"),
  uploadImage,
  uploadImageToCloudinary,
  coDriverController.updateImage
);
// Lấy danh sách tất cả
route.get(
  "/",
  // verifyAccessToken, authorizeRoles("admin"),
  coDriverController.getAll
);
// Lấy chi tiết
route.get(
  "/:id",
  // verifyAccessToken, authorizeRoles("admin"),
  coDriverController.fetch
);

export default route;
