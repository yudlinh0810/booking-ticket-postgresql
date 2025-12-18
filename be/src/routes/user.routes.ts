import { userController } from "@/controllers";
import { uploadImage, uploadImageToCloudinary } from "@/middlewares";
import { authService } from "@/services";
import express from "express";

const userRouter = express.Router();

userRouter.put(
  "/:id",
  authService.verifyAccessToken,
  uploadImage,
  uploadImageToCloudinary,
  userController.updateUserByRole
);
userRouter.get("/refresh-token", userController.refreshToken);
userRouter.get("/me", authService.verifyAccessToken, userController.fetchUser);
userRouter.post("/logout", authService.verifyAccessToken, userController.logout);
// reset password
userRouter.post("/reset-password", userController.resetPassword);
// confirm reset  password
userRouter.post("/confirm-reset-password", userController.confirmResetPassword);

export default userRouter;
