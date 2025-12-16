import express from "express";
import {
  uploadImages,
  uploadImagesToCloudinary,
  uploadImageToCloudinary,
} from "@/middlewares/uploadHandler";
import { uploadImage } from "@/middlewares/multerConfig";
import { AuthService } from "@/services/auth.service";
import { authorizeRoles } from "@/middlewares/auth.middleware";
import { CarController } from "@/controllers/car.controller";

const carRouter = express.Router();
const carController = new CarController();
const authService = new AuthService();

// Thêm xe mới
carRouter.post(
  "/", // Thay vì /add
  authService.verifyAccessToken,
  authorizeRoles("admin"),
  uploadImages,
  uploadImagesToCloudinary,
  carController.addCar
);
// Cập nhật thông tin xe
carRouter.put(
  "/:id", // Thay vì /update. Giả định bạn truyền ID qua body hoặc /:id
  authService.verifyAccessToken,
  authorizeRoles("admin"),
  uploadImages,
  uploadImagesToCloudinary,
  carController.updateCar
);
// Thêm ảnh của xe
carRouter.post(
  "/:id/image",
  authService.verifyAccessToken,
  authorizeRoles("admin"),
  uploadImage,
  uploadImageToCloudinary,
  carController.updateImgCar
);
// Cập nhật ảnh của xe
carRouter.put(
  "/:id/image",
  authService.verifyAccessToken,
  authorizeRoles("admin"),
  uploadImage,
  uploadImageToCloudinary,
  carController.updateImgCar
);
// Xóa ảnh của xe
carRouter.delete(
  "/:id/image",
  authService.verifyAccessToken,
  authorizeRoles("admin"),
  carController.deleteImgCar
);
// Xóa xe
carRouter.delete(
  "/:id",
  authService.verifyAccessToken,
  authorizeRoles("admin"),
  carController.deleteCar
);
// Lấy danh sách tất cả xe
carRouter.get("/", authService.verifyAccessToken, authorizeRoles("admin"), carController.getAllCar);

// Lấy chi tiết theo biển số
carRouter.get(
  "/license-plate/:licensePlate",
  authService.verifyAccessToken,
  authorizeRoles("admin", "customer"),
  carController.getCarByLicensePlate
);

export default carRouter;
