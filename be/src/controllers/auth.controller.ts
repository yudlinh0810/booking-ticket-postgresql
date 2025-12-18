import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { errorResponse, successResponse } from "@/utils/response.util";
import { customerService } from "@/services";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
export class AuthController {
  googleAuthHandler = async (req: Request, res: Response): Promise<any> => {
    try {
      const { token } = req.body;

      if (!token) {
        return errorResponse(res, "Token is required", 400);
      }

      // Verify Token với Google Server
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload(); // Lấy thông tin user đã giải mã

      if (!payload) {
        return errorResponse(res, "Invalid Google Token", 400);
      }

      const { status, message, action, user, tokenAuth } =
        await customerService.loginOAuthWithGoogle(payload);

      if (status === "ERROR") {
        return errorResponse(res, message);
      }

      res.cookie("access_token", tokenAuth.access_token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 60 * 60 * 1000,
      });

      res.cookie("refresh_token", tokenAuth.refresh_token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 60 * 60 * 24 * 7 * 1000,
      });

      return successResponse(res, 200, { status, message, action, user });
    } catch (error: any) {
      console.error("Google Auth Error:", error);
      if (error.action === "conflict") {
        return errorResponse(res, error.message, 409);
      }
      return errorResponse(res, "Internal Server Error", 500);
    }
  };
}
