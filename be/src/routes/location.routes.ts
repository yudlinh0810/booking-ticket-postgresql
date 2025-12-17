import express from "express";

import { AuthService } from "@/services/auth.service";
import { authorizeRoles } from "@/middlewares/auth.middleware";
import { LocationController } from "@/controllers/location.controller";

const locationController = new LocationController();
const authService = new AuthService();

const route = express.Router();

route.post("/", authService.verifyAccessToken, authorizeRoles("admin"), locationController.add);

export default route;
