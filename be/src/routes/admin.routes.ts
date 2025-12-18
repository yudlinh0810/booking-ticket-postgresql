import express from "express";
import { authorizeRoles } from "@/middlewares/auth.middleware";
import { AdminController } from "@/controllers/admin.controller";
import { UserController } from "@/controllers/user.controller";
import { AuthService } from "@/services/auth.service";

const router = express.Router();
const adminController = new AdminController();
const userController = new UserController();
const authService = new AuthService();

// create admin
router.post(
  "/",
  authService.verifyAccessToken,
  authorizeRoles("admin", "super_admin"),
  adminController.create
);
// get all admins with pagination
router.get(
  "/",
  authService.verifyAccessToken,
  authorizeRoles("admin", "super_admin"),
  adminController.getAdminsPagination
);
// get admin by id
router.get(
  "/:id",
  authService.verifyAccessToken,
  authorizeRoles("admin", "super_admin"),
  userController.fetchUser
);
// update admin details
router.put(
  "/profile",
  authService.verifyAccessToken,
  authorizeRoles("admin", "super_admin"),
  adminController.updateAdminDetails
);
// update admin password
router.put(
  "/password",
  authService.verifyAccessToken,
  authorizeRoles("admin", "super_admin"),
  adminController.updateAdminPassword
);

export default router;
