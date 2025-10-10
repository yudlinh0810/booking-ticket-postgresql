import express from "express";

import { UserController } from "../controllers/user.controller";
import { verifyAccessToken } from "../services/auth.service";

const router = express.Router();
const userController = new UserController();

router.post("/auth/admin/login", userController.loginByAdmin);
router.post("/auth/customer/login", userController.loginByCustomer);
router.post("/auth/driver/login", userController.loginByDriver);
router.post("/auth/co-driver/login", userController.loginByCoDriver);
router.get("/detail", verifyAccessToken, userController.getUserDetail);
router.post("/auth/logout", verifyAccessToken, userController.logout);
router.get("/auth/refresh-token", userController.refreshToken);

export default router;
