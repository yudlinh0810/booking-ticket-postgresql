import { Request, Response } from "express";
import { errorResponse, successResponse } from "../utils/response.util";
import { RequestFile } from "../middlewares/uploadHandler";
import { CloudinaryAsset } from "../@types/cloudinary";
import { ArrangeType } from "../@types/type";
import { bookBusTicketsDB } from "../config/db";
import { DriverService } from "../services/driver.service";

export class DriverController {
  private driverService = new DriverService(bookBusTicketsDB);

  register = async (req: Request, res: Response): Promise<any> => {
    try {
      const { email, password, confirmPassword } = req.body;
      const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
      const isCheckEmail = reg.test(email);

      if (!email || !password || !confirmPassword) {
        return errorResponse(res, "The input is required", 400);
      }

      if (!isCheckEmail) {
        return errorResponse(res, "Email is not in correct format", 400);
      }

      if (password !== confirmPassword) {
        return errorResponse(res, "Password and confirm password are not the same", 400);
      }

      const data = await this.driverService.register(req.body);
      if (data.status === "ERR") {
        return errorResponse(res, data.message, 400);
      }

      const { refresh_token, ...response } = data;

      res.cookie("refresh_token", refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return successResponse(res, 200, response);
    } catch (error) {
      return errorResponse(res, "Controller.register", 500);
    }
  };

  verifyEmail = async (req: Request, res: Response): Promise<any> => {
    try {
      const { email, otp } = req.body;
      const response = await this.driverService.verifyEmail(email, otp);
      if (response.status === "ERR") {
        return errorResponse(res, response.message, 400);
      }
      return successResponse(res, 200, response);
    } catch (error) {
      return errorResponse(res, "ERR Controller.verifyEmail", 500);
    }
  };

  fetch = async (req: Request, res: Response): Promise<any> => {
    const id = Number(req.params.id);
    try {
      const response = await this.driverService.fetch(id);
      if (response.status === "ERR") {
        return errorResponse(res, response.message, 400);
      }
      return successResponse(res, 200, response);
    } catch (error) {
      return errorResponse(res, "ERR Controller.fetch", 500);
    }
  };

  update = async (req: Request, res: Response): Promise<any> => {
    try {
      const id = Number(req.params.id);
      if (!id) return errorResponse(res, "id is required", 400);
      const updateData = req.body;
      const response = await this.driverService.update(id, updateData);
      if (response.status === "ERR") {
        return errorResponse(res, response.message, 400);
      }
      return successResponse(res, 200, response);
    } catch (error) {
      console.log("Err Controller", error);
      return errorResponse(res, "ERR Controller.update", 500);
    }
  };

  updateImage = async (req: RequestFile, res: Response): Promise<any> => {
    try {
      const id = Number(req.body.id);
      const file = req.uploadedImage as CloudinaryAsset;
      const publicId = req.body.publicId;
      if (!id) return errorResponse(res, "id is required", 400);
      const response = await this.driverService.updateImage(id, publicId, file);
      if (response.status === "ERR") {
        return errorResponse(res, response.message, 400);
      }
      return successResponse(res, 200, response);
    } catch (error) {
      console.log("Err Controller", error);
      return errorResponse(res, "ERR Controller.updateImage", 500);
    }
  };

  getAll = async (req: Request, res: Response): Promise<any> => {
    try {
      const phoneSearch = (req.query.phone as string) || "";
      const limit = Number(req.query.limit) || 10;
      const offset = Number(req.query.offset);
      const arrangeType =
        (req.query.arrangeType as string)?.toUpperCase() === "ASC"
          ? "ASC"
          : ("DESC" as ArrangeType);

      if (limit < 0 || offset < 0)
        return errorResponse(res, "limit and offset must be greater than 0", 404);

      const response = await this.driverService.getAll(limit, offset, arrangeType, phoneSearch);
      return successResponse(res, 200, response);
    } catch (error) {
      console.log("Err Controller", error);
      return errorResponse(res, "ERR Controller.getAll", 500);
    }
  };

  create = async (req: RequestFile, res: Response): Promise<any> => {
    try {
      const file = req.uploadedImage as CloudinaryAsset;
      const newDriver = JSON.parse(req.body.data);
      const response = await this.driverService.add(newDriver, file);
      if (response.status === "ERR") {
        return errorResponse(res, response.message, 400);
      }
      return successResponse(res, 200, response);
    } catch (error) {
      console.log("Err Controller", error);
      return errorResponse(res, "ERR Controller.create", 500);
    }
  };
}
