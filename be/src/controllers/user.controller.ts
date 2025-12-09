import { Request, Response } from "express";
import { bookBusTicketsDB } from "../config/db";
import { UserService } from "../services/user.service";
import { errorResponse, successResponse } from "../utils/response.util";
import { verifyRefreshToken } from "../services/auth.service";
import testEmail from "../utils/testEmail";
import { redisClient } from "../config/redis";
import { CloudinaryAsset, RequestWithUploadedImage } from "../@types/interface";
import { UpdateUserMapper } from "../dto/user";
import { AuthCacheService } from "@/services/cache/authCache.service";

export class UserController {
  private authCacheService = new AuthCacheService(redisClient);
  private userService = new UserService();

  refreshToken = async (req: Request, res: Response): Promise<any> => {
    try {
      const refreshToken = req.cookies.refresh_token;

      if (!refreshToken) return errorResponse(res, "Refresh token is required", 400);

      const response = await verifyRefreshToken(refreshToken);

      if ("access_token" in response && "expirationTime" in response) {
        const { access_token, expirationTime } = response;

        const sessionKey = `session_${response.id}`;
        await redisClient.set(sessionKey, access_token, { EX: 60 * 60 });

        res.cookie("access_token", access_token, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 60 * 60 * 1000,
          path: "/",
        });
        return successResponse(res, 200, { expirationTime: expirationTime });
      } else {
        return errorResponse(res, response.message, 400);
      }
    } catch (error) {
      return errorResponse(res, "ERR Controller.refreshToken", 500);
    }
  };

  delete = async (req: Request, res: Response): Promise<any> => {
    const id = Number(req.params.id);
    try {
      const data = await this.userService.delete(id);
      if (data === true) {
        return successResponse(res, 400);
      } else {
        return errorResponse(res, "Delete failed", 404);
      }
    } catch (error) {
      return errorResponse(res, "ERR Controller.deleteUser", 500);
    }
  };

  logout = async (req: Request, res: Response): Promise<any> => {
    try {
      await this.authCacheService.deleteToken(req.user.id);

      res.clearCookie("access_token", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
      });
      res.clearCookie("refresh_token", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
      });

      return successResponse(res, 200, { status: "OK", message: "Logout success" });
    } catch (error) {
      console.log("Controller", error);
      return errorResponse(res, "ERR Controller.logout", 500);
    }
  };

  updateUserByRole = async (req: RequestWithUploadedImage, res: Response): Promise<any> => {
    try {
      let updateData = JSON.parse(req.body.data);
      const id = Number(req.params.id),
        newAvatar = req.uploadedImage as CloudinaryAsset;

      const result = await this.userService.updateByRole(
        id,
        updateData.role,
        updateData,
        newAvatar
      );
      if (result.status === "OK") {
        return successResponse(res, 200, result);
      } else {
        return errorResponse(res, result.status, 404);
      }
    } catch (error) {
      console.log("Err Controller", error);
      return errorResponse(res, "ERR Controller.update", 500);
    }
  };

  fetchUser = async (req: RequestWithUploadedImage, res: Response): Promise<any> => {
    try {
      const { id, role } = req.user;
      const result = await this.userService.fetch(id, role);
      return successResponse(res, 200, result);
    } catch (error) {
      return errorResponse(res, "ERR fetch (userController)", 500);
    }
  };
}
