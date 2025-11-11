import ticketController from "../controllers/ticket.controller";
import { authorizeRoles } from "../middlewares/auth.middleware";
import { verifyAccessToken } from "../services/auth.service";
import express from "express";

const router = express.Router();

// Thêm mới
router.post("/", verifyAccessToken, authorizeRoles("customer", "admin"), ticketController.add);
// Lấy chi tiết vé (tìm vé theo sđt, ticketId)
router.get("/detail", ticketController.getDetailTicket);
// Lấy chi tiết vé bằng email (POST chuyển thành GET)
router.get("/email", ticketController.getDetailTicketByEmail);
// Lấy chi tiết vé bằng ID
router.get("/:id", ticketController.getDetailTicketById);
// Xóa
router.delete("/:id", ticketController.deleteById);
// Lấy danh sách tất cả
router.get("/", verifyAccessToken, authorizeRoles("admin"), ticketController.getAllTicket);
// Cập nhật
router.put("/:id", verifyAccessToken, authorizeRoles("admin"), ticketController.updateById);

export default router;
