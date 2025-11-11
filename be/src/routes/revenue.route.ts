import express from "express";
import { verifyAccessToken } from "../services/auth.service";
import { authorizeRoles } from "../middlewares/auth.middleware";
import revenueController from "../controllers/revenue.controller";

const router = express.Router();

router.get(
  "/hourly",
  verifyAccessToken,
  authorizeRoles("admin"),
  revenueController.getHourlyRevenue
);

router.get(
  "/monthly",
  verifyAccessToken,
  authorizeRoles("admin"),
  revenueController.getMonthlyRevenue
);

router.get(
  "/yearly",
  verifyAccessToken,
  authorizeRoles("admin"),
  revenueController.getYearlyRevenue
);

export default router;
