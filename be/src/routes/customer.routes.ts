import { CustomerController } from "@/controllers/customer.controller";
import { AuthService } from "@/services/auth.service";
import express from "express";

const route = express.Router();
const customerControlelr = new CustomerController();
const authService = new AuthService();

route.get("/auth/profile", authService.verifyAccessToken, customerControlelr.getProfile);

export default route;
