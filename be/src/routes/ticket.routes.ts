import ticketController from "../controllers/ticket.controller";
import { authorizeRoles } from "../middlewares/auth.middleware";
import { verifyAccessToken } from "../services/auth.service";
import express from "express";

const router = express.Router();

router.post("/add", verifyAccessToken, authorizeRoles("customer", "admin"), ticketController.add);
router.post("/get-detail-ticket/", ticketController.getDetailTicket);
router.post("/get-detail-ticket-by-email/", ticketController.getDetailTicketByEmail);
router.get("/get-detail-ticket-by-id/:id", ticketController.getDetailTicketById);
router.delete("/delete/:id", ticketController.deleteById);
router.get("/get-all", verifyAccessToken, authorizeRoles("admin"), ticketController.getAllTicket);

export default router;
