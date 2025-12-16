import { AuthService } from "@/services/auth.service";
import { authorizeRoles } from "@/middlewares/auth.middleware";
import { TripController } from "@/controllers/trip.controller";
import express from "express";

const router = express.Router();
const tripController = new TripController();
const authService = new AuthService();

router.get(
  "/form-data",
  authService.verifyAccessToken,
  authorizeRoles("admin"),
  tripController.getFormData
);
// Thêm mới
router.post("/", authService.verifyAccessToken, authorizeRoles("admin"), tripController.add);
// Lấy danh sách tất cả
router.get("/", authService.verifyAccessToken, tripController.getAll);
// Lấy chi tiết
router.get("/:id", authService.verifyAccessToken, tripController.fetch);
router.post("/search", tripController.search);
// Lấy chi tiết chuyến đi đã đặt
router.get("/booked", tripController.getDetailTripBooked);

export default router;
