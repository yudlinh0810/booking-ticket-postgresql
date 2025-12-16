import { AuthController } from "@/controllers/auth.controller";
import express from "express";

const router = express.Router();
const authController = new AuthController();

router.post("/google-login", authController.googleAuthHandler);

export default router;
