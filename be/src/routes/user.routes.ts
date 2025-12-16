import express from "express";

import { UserController } from "@/controllers/user.controller";
import { uploadImageToCloudinary } from "@/middlewares/uploadHandler";
import { uploadImage } from "@/middlewares/multerConfig";
import { AuthService } from "@/services/auth.service";

const router = express.Router();
const userController = new UserController();
const authService = new AuthService();

router.put(
  "/:id",
  authService.verifyAccessToken,
  uploadImage,
  uploadImageToCloudinary,
  userController.updateUserByRole
);
router.get("/auth/refresh-token", userController.refreshToken);
// router.get("/auth/me", authService.verifyAccessToken, userController.fetchUser);
router.post("/auth/logout", authService.verifyAccessToken, userController.logout);

export default router;
