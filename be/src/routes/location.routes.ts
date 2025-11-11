import express from "express";

import { verifyAccessToken } from "../services/auth.service";
import { authorizeRoles } from "../middlewares/auth.middleware";
import { LocationController } from "../controllers/location.controller";

const locationController = new LocationController();

const route = express.Router();

// Lấy danh sách tất cả
route.get("/", locationController.getAll);
// Thêm mới
route.post("/", verifyAccessToken, authorizeRoles("admin"), locationController.add);
// Xóa
route.delete("/:id", verifyAccessToken, authorizeRoles("admin"), locationController.delete);

export default route;
