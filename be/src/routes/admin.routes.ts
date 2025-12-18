import { adminController, userController } from "@/controllers";
import { authorizeRoles } from "@/middlewares/auth.middleware";
import { authService } from "@/services";
import express from "express";

const adminRouter = express.Router();

// create admin
adminRouter.post(
  "/",
  authService.verifyAccessToken,
  authorizeRoles("admin", "super_admin"),
  adminController.create
);
// get all admins with pagination
adminRouter.get(
  "/",
  authService.verifyAccessToken,
  authorizeRoles("admin", "super_admin"),
  adminController.getAdminsPagination
);
// get admin by id
adminRouter.get(
  "/:id",
  authService.verifyAccessToken,
  authorizeRoles("admin", "super_admin"),
  userController.fetchUser
);
// update admin details
adminRouter.put(
  "/profile",
  authService.verifyAccessToken,
  authorizeRoles("admin", "super_admin"),
  adminController.updateAdminDetails
);
// update admin password
adminRouter.put(
  "/password",
  authService.verifyAccessToken,
  authorizeRoles("admin", "super_admin"),
  adminController.updateAdminPassword
);

export default adminRouter;
