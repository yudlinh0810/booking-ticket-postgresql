import express from "express";
import { authorizeRoles } from "@/middlewares/auth.middleware";
import { AdminController } from "@/controllers/admin.controller";
import { UserController } from "@/controllers/user.controller";
import { AuthService } from "@/services/auth.service";

const route = express.Router();
const adminController = new AdminController();
const userController = new UserController();
const authService = new AuthService();

// create admin
route.post(
  "/",
  authService.verifyAccessToken,
  authorizeRoles("admin", "super_admin"),
  adminController.create
);
// get all admins with pagination
route.get(
  "/",
  authService.verifyAccessToken,
  authorizeRoles("admin", "super_admin"),
  adminController.getAll
);
// get admin by id
route.get(
  "/:id",
  authService.verifyAccessToken,
  authorizeRoles("admin", "super_admin"),
  userController.fetchUser
);
// update admin details
route.put(
  "/profile",
  authService.verifyAccessToken,
  authorizeRoles("admin", "super_admin"),
  adminController.updateAdminDetails
);
// update admin password
route.put(
  "/password",
  authService.verifyAccessToken,
  authorizeRoles("admin", "super_admin"),
  adminController.updateAdminPassword
);
// reset admin password
route.post(
  "/reset-password",
  authService.verifyAccessToken,
  authorizeRoles("admin", "super_admin"),
  adminController.resetAdminPassword
);
// confirm reset admin password
route.post("/confirm-reset-password", adminController.confirmResetAdminPassword);

export default route;
