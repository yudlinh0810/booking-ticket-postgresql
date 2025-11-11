import express from "express";
import { verifyAccessToken } from "../services/auth.service";
import { authorizeRoles } from "../middlewares/auth.middleware";
import { AdminController } from "../controllers/admin.controller";

const route = express.Router();
const adminController = new AdminController();
// Tạo mới
route.post("/", verifyAccessToken, authorizeRoles("admin"), adminController.create);
// Cập nhật
route.put("/:id", verifyAccessToken, authorizeRoles("admin"), adminController.update);
// Lấy danh sách tất cả
route.get("/", verifyAccessToken, authorizeRoles("admin"), adminController.getAll);
// Lấy chi tiết
route.get("/:id", verifyAccessToken, authorizeRoles("admin"), adminController.fetch);

export default route;
