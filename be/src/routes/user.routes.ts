import express from "express";

import { UserController } from "../controllers/user.controller";
import { verifyAccessToken } from "../services/auth.service";
import { uploadImageToCloudinary } from "../middlewares/uploadHandler";
import { uploadImage } from "../middlewares/multerConfig";

const router = express.Router();
const userController = new UserController();

router.put(
  "/:id",
  verifyAccessToken,
  uploadImage,
  uploadImageToCloudinary,
  userController.updateUserByRole
);
router.get("/auth/refresh-token", userController.refreshToken);
router.get("/auth/me", verifyAccessToken, userController.fetchUser);
router.post("/auth/logout", userController.logout);

export default router;
