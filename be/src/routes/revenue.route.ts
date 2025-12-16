import express from "express";
import { authorizeRoles } from "@/middlewares/auth.middleware";
import revenueController from "@/controllers/revenue.controller";
import { AuthService } from "@/services/auth.service";

const router = express.Router();
const authService = new AuthService();

router.get(
  "/hourly",
  authService.verifyAccessToken,
  authorizeRoles("admin"),
  revenueController.getHourlyRevenue
);

router.get(
  "/monthly",
  authService.verifyAccessToken,
  authorizeRoles("admin"),
  revenueController.getMonthlyRevenue
);

router.get(
  "/yearly",
  authService.verifyAccessToken,
  authorizeRoles("admin"),
  revenueController.getYearlyRevenue
);

export default router;
