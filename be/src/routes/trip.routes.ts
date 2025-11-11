import { authorizeRoles } from "../middlewares/auth.middleware";
import { verifyAccessToken } from "../services/auth.service";
import { TripController } from "./../controllers/trip.controller";
import express from "express";

const router = express.Router();
const tripController = new TripController();

router.get("/form-data", verifyAccessToken, authorizeRoles("admin"), tripController.getFormData);
// Thêm mới
router.post("/", verifyAccessToken, authorizeRoles("admin"), tripController.add);
// Lấy danh sách tất cả
router.get("/", verifyAccessToken, tripController.getAll);
// Lấy chi tiết
router.get("/:id", verifyAccessToken, tripController.fetch);
router.post("/search", tripController.search);
// Lấy chi tiết chuyến đi đã đặt
router.get("/booked", tripController.getDetailTripBooked);

export default router;
