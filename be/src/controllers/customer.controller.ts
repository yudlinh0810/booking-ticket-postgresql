import { Request, Response } from "express";
import { errorResponse, successResponse } from "../utils/response.util";
import { RequestFile } from "../middlewares/uploadHandler";
import { CloudinaryAsset } from "../@types/cloudinary";
import { ArrangeType } from "../@types/type";
import { CustomerService } from "../services/customer.service";
import { bookBusTicketsDB } from "../config/db";
import testEmail from "../utils/testEmail";

export class CustomerController {
  private customerService = new CustomerService(bookBusTicketsDB);

  register = async (req: Request, res: Response): Promise<any> => {
    try {
      const { email, password, confirmPassword } = req.body;

      const isCheckEmail = testEmail(email);

      if (!email || !password || !confirmPassword) {
        return errorResponse(res, "The input is required", 400);
      }

      if (!isCheckEmail) {
        return errorResponse(res, "Email is not in correct format", 400);
      }

      if (password !== confirmPassword) {
        return errorResponse(res, "Password and confirm password are not the same", 400);
      }

      const response = await this.customerService.register(req.body);

      if (response.status === "ERR") {
        return errorResponse(res, response.message, 400);
      } else {
        return successResponse(res, 200, response);
      }
    } catch (error) {
      console.log("Err Controller", error);
      return errorResponse(res, "Controller.register", 500);
    }
  };

  insertOtp = async (req: Request, res: Response): Promise<any> => {
    try {
      const { email } = req.body;

      const isCheckEmail = testEmail(email);

      if (!email) {
        return errorResponse(res, "The input is required", 400);
      }

      if (!isCheckEmail) {
        return errorResponse(res, "Email is not in correct format", 400);
      }

      const response = await this.customerService.insertOtp(email);

      if (response.status === "ERR") {
        return errorResponse(res, response.message, 200);
      } else {
        return successResponse(res, 200, response);
      }
    } catch (error) {
      console.log("Err Controller", error);
      return errorResponse(res, "Controller.register", 500);
    }
  };

  sendOtp = async (req: Request, res: Response): Promise<any> => {
    try {
      const { email } = req.body;

      const isCheckEmail = testEmail(email);

      if (!email) {
        return errorResponse(res, "The input is required", 400);
      }

      if (!isCheckEmail) {
        return errorResponse(res, "Email is not in correct format", 400);
      }

      const response = await this.customerService.sendOtp(email);

      if (response.status === "ERR") {
        return errorResponse(res, response.message, 400);
      } else {
        return successResponse(res, 200, response);
      }
    } catch (error) {
      console.log("Err Controller", error);
      return errorResponse(res, "Controller.register", 500);
    }
  };

  updatePassword = async (req: Request, res: Response): Promise<any> => {
    try {
      const { email, passwordOld, passwordNew } = req.body;

      const isCheckEmail = testEmail(email);

      if (!email || !passwordOld || !passwordNew) {
        return errorResponse(res, "The input is required", 400);
      }

      if (!isCheckEmail) {
        return errorResponse(res, "Email is not in correct format", 400);
      }

      const response = await this.customerService.updatePassword(req.body);

      if (response.status === "ERR") {
        return errorResponse(res, response.message, 400);
      } else {
        return successResponse(res, 200, response);
      }
    } catch (error) {
      console.log("Err Controller", error);
      return errorResponse(res, "Controller.register", 500);
    }
  };

  updateNewPassword = async (req: Request, res: Response): Promise<any> => {
    try {
      const { email, passwordNew } = req.body;

      const isCheckEmail = testEmail(email);

      if (!email || !passwordNew) {
        return errorResponse(res, "The input is required", 400);
      }

      if (!isCheckEmail) {
        return errorResponse(res, "Email is not in correct format", 400);
      }

      const response = await this.customerService.updateNewPassword(req.body);

      if (response.status === "ERR") {
        return errorResponse(res, response.message, 400);
      } else {
        return successResponse(res, 200, response);
      }
    } catch (error) {
      console.log("Err Controller", error);
      return errorResponse(res, "Controller.register", 500);
    }
  };

  verifyEmail = async (req: Request, res: Response): Promise<any> => {
    try {
      const { email, otp } = req.body;

      const isCheckEmail = testEmail(email);

      if (!email || !otp) {
        return errorResponse(res, "The input is required", 400);
      }

      if (!isCheckEmail) {
        return errorResponse(res, "Email is not in correct format", 400);
      }

      const response = await this.customerService.verifyEmail(email, otp);
      if (
        "access_token" in response &&
        "refresh_token" in response &&
        "expirationTime" in response
      ) {
        const { access_token, data, refresh_token, status, expirationTime } = response;
        res.cookie("access_token", access_token, {
          httpOnly: false,
          secure: true,
          sameSite: "none",
          maxAge: 60 * 60 * 1000,
          path: "/",
        });

        res.cookie("refresh_token", refresh_token, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 7 * 24 * 60 * 60 * 1000,
          path: "/",
        });
        return successResponse(res, 200, {
          status,
          message: "Verify email success",
          data,
          expirationTime: expirationTime,
        });
      } else {
        if ("message" in response) {
          return errorResponse(res, response.message, 400);
        } else {
          return errorResponse(res, "Unexpected error occurred", 400);
        }
      }
    } catch (error) {
      return errorResponse(res, "ERR Controller.verifyEmail", 500);
    }
  };

  verifyEmailForgotPassword = async (req: Request, res: Response): Promise<any> => {
    try {
      const { email, otp } = req.body;
      const isCheckEmail = testEmail(email);

      if (!email || !otp) {
        return errorResponse(res, "The input is required", 400);
      }

      if (!isCheckEmail) {
        return errorResponse(res, "Email is not in correct format", 400);
      }

      const response = await this.customerService.verifyEmailForgotPassword(email, otp);

      if (response.status === "ERR") {
        return errorResponse(res, response.message, 400);
      } else {
        return successResponse(res, 200, response);
      }
    } catch (error) {
      return errorResponse(res, "ERR Controller.verifyEmail", 500);
    }
  };

  fetch = async (req: Request, res: Response): Promise<any> => {
    const id = Number(req.params.id);
    try {
      const result = await this.customerService.fetch(id);
      return successResponse(res, 200, result);
    } catch (error) {
      return errorResponse(res, "ERR Controller.fetch", 500);
    }
  };

  getDetailUserByEmail = async (req: Request, res: Response): Promise<any> => {
    const email = req.body;
    try {
      const result = await this.customerService.getDetailUserByEmail(email);
      return successResponse(res, 200, result);
    } catch (error) {
      return errorResponse(res, "ERR Controller.getDetailUserByEmail", 500);
    }
  };

  update = async (req: Request, res: Response): Promise<any> => {
    try {
      const id = Number(req.params.id);
      if (!id) return errorResponse(res, "id is required", 404);

      const updateData = req.body;
      const result = await this.customerService.update(id, updateData);
      return successResponse(res, 200, result);
    } catch (error) {
      console.log("Err Controller", error);
      return errorResponse(res, "ERR Controller.update", 500);
    }
  };

  updateNoImage = async (req: Request, res: Response): Promise<any> => {
    try {
      const updateData = req.body;
      const result = await this.customerService.updateNoImage(updateData);
      return successResponse(res, 200, result);
    } catch (error) {
      console.log("Err Controller", error);
      return errorResponse(res, "ERR Controller.update", 500);
    }
  };

  updateUser = async (req: RequestFile, res: Response): Promise<any> => {
    try {
      const updateData = JSON.parse(req.body.data);
      const file = req.uploadedImage as CloudinaryAsset;
      const publicId = req.body.publicId;

      const result = await this.customerService.updateUser(updateData, publicId, file);
      if (result.status === "ERR") {
        return errorResponse(res, result.message, 404);
      } else {
        return successResponse(res, 200, result);
      }
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
      if (!id) return errorResponse(res, "id is required", 404);

      const result = await this.customerService.updateImage(id, publicId, file);
      return successResponse(res, 200, result);
    } catch (error) {
      console.log("Err Controller", error);
      return errorResponse(res, "ERR Controller.updateImage", 500);
    }
  };

  getAll = async (req: Request, res: Response): Promise<any> => {
    try {
      const emailSearch = (req.query.email as string) || "";
      const limit = Number(req.query.limit) || 10;
      const offset = Number(req.query.offset);
      const arrangeType =
        (req.query.arrangeType as string)?.toUpperCase() === "ASC"
          ? "ASC"
          : ("DESC" as ArrangeType);

      if (limit < 0 || offset < 0)
        return errorResponse(res, "limit and offset must be greater than 0", 404);

      const result = await this.customerService.getAll(limit, offset, arrangeType, emailSearch);
      return successResponse(res, 200, result);
    } catch (error) {
      console.log("Err Controller", error);
      return errorResponse(res, "ERR Controller.getAll", 500);
    }
  };

  create = async (req: RequestFile, res: Response): Promise<any> => {
    try {
      const file = req.uploadedImage as CloudinaryAsset;
      const newCustomer = JSON.parse(req.body.data);
      const result = await this.customerService.add(newCustomer, file);
      return successResponse(res, 200, result);
    } catch (error) {
      console.log("Err Controller", error);
      return errorResponse(res, "ERR Controller.create", 500);
    }
  };
}
