import express from "express";

import { AuthService } from "@/services/auth.service";
import { authorizeRoles } from "@/middlewares/auth.middleware";
import { LocationController } from "@/controllers/location.controller";

const locationController = new LocationController();
const authService = new AuthService();

const route = express.Router();

// Lấy danh sách tất cả
route.get("/", locationController.getAll);
// Thêm mới
route.post("/", authService.verifyAccessToken, authorizeRoles("admin"), locationController.add);
// Xóa
route.delete(
  "/:id",
  authService.verifyAccessToken,
  authorizeRoles("admin"),
  locationController.delete
);

export default route;
