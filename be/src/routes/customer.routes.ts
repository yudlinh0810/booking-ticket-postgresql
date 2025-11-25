import express from "express";

import { uploadImageToCloudinary } from "../middlewares/uploadHandler";
import { uploadImage } from "../middlewares/multerConfig";
import { CustomerController } from "../controllers/customer.controller";
import { UserController } from "../controllers/user.controller";
import { verifyAccessToken } from "../services/auth.service";
import { authorizeRoles } from "../middlewares/auth.middleware";

const router = express.Router();
const customerController = new CustomerController();
const userController = new UserController();

router.post("/register", customerController.register);
router.post("/verify-email", customerController.verifyEmail);
router.post("/verify-email-forgot-password", customerController.verifyEmailForgotPassword);
// Lấy danh sách tất cả
router.get("/", verifyAccessToken, authorizeRoles("admin"), customerController.getAll);
// Lấy chi tiết của chính người dùng
router.get("/me", verifyAccessToken, customerController.fetchMe);
// Lấy chi tiết
router.get(
  "/:id",
  verifyAccessToken,
  authorizeRoles("admin", "customer"),
  customerController.fetch
);
// Lấy chi tiết bằng email
router.post("/email", customerController.getDetailUserByEmail);
// Cập nhật thông tin người dùng (PUT is more appropriate for update)
// Cập nhật mật khẩu (PUT is more appropriate for update)
router.put("/password", customerController.updatePassword);
// Cập nhật mật khẩu mới (PUT is more appropriate for update)
router.put("/new-password/:id", customerController.updateNewPassword);
// Chèn OTP
router.post("/otp/forgot-password", customerController.insertOtp);
// Gửi OTP
router.post("/otp/send", customerController.sendOtp);

// Tạo mới
router.post(
  "/", // Thay vì /create
  verifyAccessToken,
  authorizeRoles("admin"),
  uploadImage,
  uploadImageToCloudinary,
  customerController.create
);

// Xóa
router.delete("/:id", verifyAccessToken, authorizeRoles("admin"), userController.delete);

export default router;
