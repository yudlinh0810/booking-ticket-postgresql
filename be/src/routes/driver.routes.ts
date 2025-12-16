import express from "express";

import { uploadImageToCloudinary } from "@/middlewares/uploadHandler";
import { uploadImage } from "@/middlewares/multerConfig";
import { UserController } from "@/controllers/user.controller";
import { DriverController } from "@/controllers/driver.controller";
import { authorizeRoles } from "@/middlewares/auth.middleware";

const router = express.Router();
const driverController = new DriverController();
const userController = new UserController();

export default router;
