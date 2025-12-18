import { CustomerController } from "@/controllers/customer.controller";
import { AuthService } from "@/services/auth.service";
import express from "express";

const router = express.Router();
const customerControlelr = new CustomerController();
const authService = new AuthService();

router.get("/auth/profile", authService.verifyAccessToken, customerControlelr.getProfile);

export default router;
