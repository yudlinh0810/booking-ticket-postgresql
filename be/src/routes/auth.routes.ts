import { authController } from "@/controllers";
import express from "express";

const authRouter = express.Router();

authRouter.post("/google-login", authController.googleAuthHandler);

export default authRouter;
