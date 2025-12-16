import express from "express";
import { authorizeRoles } from "@/middlewares/auth.middleware";
import { AdminController } from "@/controllers/admin.controller";
import { UserController } from "@/controllers/user.controller";
import { AuthService } from "@/services/auth.service";

const route = express.Router();
const adminController = new AdminController();
const userController = new UserController();
const authService = new AuthService();

// Tạo mới
route.post("/", authService.verifyAccessToken, authorizeRoles("admin"), adminController.create);
// Cập nhật
// Lấy danh sách tất cả
route.get("/", authService.verifyAccessToken, authorizeRoles("admin"), adminController.getAll);
// Lấy chi tiết
route.get("/:id", authService.verifyAccessToken, authorizeRoles("admin"), userController.fetchUser);

export default route;
