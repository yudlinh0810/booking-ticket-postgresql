import { customerController } from "@/controllers";
import { authService } from "@/services";
import express from "express";

const customerRouter = express.Router();

customerRouter.get("/auth/profile", authService.verifyAccessToken, customerController.getProfile);

export default customerRouter;
