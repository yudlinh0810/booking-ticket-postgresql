import express from "express";
import { authorizeRoles } from "@/middlewares/auth.middleware";
import statisticalController from "@/controllers/statistical.controller";
import { AuthService } from "@/services/auth.service";

const router = express.Router();
const authService = new AuthService();

router.get(
  "/",
  authService.verifyAccessToken,
  authorizeRoles("admin"),
  statisticalController.getDashboardSummary
);

export default router;
