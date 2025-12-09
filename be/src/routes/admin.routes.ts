import express from "express";
import { verifyAccessToken } from "../services/auth.service";
import { authorizeRoles } from "../middlewares/auth.middleware";
import { AdminController } from "../controllers/admin.controller";
import { UserController } from "@/controllers/user.controller";

const route = express.Router();
const adminController = new AdminController();
const userController = new UserController();
// Tạo mới
route.post("/", verifyAccessToken, authorizeRoles("admin"), adminController.create);
// Cập nhật
// Lấy danh sách tất cả
route.get("/", verifyAccessToken, authorizeRoles("admin"), adminController.getAll);
// Lấy chi tiết
route.get("/:id", verifyAccessToken, authorizeRoles("admin"), userController.fetchUser);

export default route;
