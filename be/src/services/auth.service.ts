import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { AuthCacheService } from "./cache/authCache.service";
import { redisClient } from "@/config/redis";
dotenv.config();

export class AuthService {
  protected authCacheService = new AuthCacheService(redisClient);

  // Tạo Access Token
  generalAccessToken = ({ id, role }: { id: string | number; role: string }): string => {
    return jwt.sign({ id, role }, process.env.ACCESS_TOKEN, { expiresIn: "1h" });
  };

  // Tạo Refresh Token
  generalRefreshToken = ({ id, role }: { id: string | number; role: string }): string => {
    return jwt.sign({ id, role }, process.env.REFRESH_TOKEN, { expiresIn: "7d" });
  };

  // Xác minh Access Token
  verifyAccessToken = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    // lấy từ cookies trước
    let accessToken = req.cookies.access_token;

    // Nếu không có trong cookies, thử lấy từ Authorization header
    if (!accessToken) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        accessToken = authHeader.split(" ")[1];
      }
    }

    if (!accessToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const decode = jwt.verify(accessToken, process.env.ACCESS_TOKEN as string) as {
        id: string;
        role: "customer" | "admin" | "driver" | "co-driver";
      };

      if (!decode || !decode.id || !decode.role) {
        return res.status(401).json({ message: "Invalid token payload" });
      }

      // kiểm tra redis
      const sessionKey = await this.authCacheService.getSessionKey(decode.id);
      const storedAccessToken = await this.authCacheService.getKey(sessionKey);
      console.log("storedAccessToken", storedAccessToken);

      if (!storedAccessToken) {
        return res.status(401).json({ message: "Session expired" });
      }

      // Nếu token trong Redis không trùng khớp → có thể đã refresh hoặc logout
      if (storedAccessToken !== accessToken) {
        return res.status(401).json({ message: "Token mismatch" });
      }

      req.user = decode as Express.User;
      next();
    } catch (error) {
      console.log("err", error);
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };

  // Xác minh Refresh Token & cấp lại Access Token
  async verifyRefreshToken(token: string): Promise<any> {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN as string) as {
      id: number; //id
      role: "customer" | "admin" | "driver" | "co-driver";
    };

    if (!decoded || !decoded.id) {
      return { status: "ERR", message: "Invalid token" };
    }

    // kiểm tra redis
    const refreshKey = await this.authCacheService.getRefreshKey(decoded.id);
    const storedRefreshToken = await this.authCacheService.getKey(refreshKey);

    if (!storedRefreshToken) {
      return { status: "ERR", message: "Session expired" };
    }

    if (storedRefreshToken !== token) {
      return {
        status: "ERR",
        message: "Refresh token mismatch. Please log in again.",
      };
    }

    const access_token = this.generalAccessToken({ id: decoded.id, role: decoded.role });

    const expirationTime = Date.now() + 60 * 60 * 1000;

    await this.authCacheService.cacheTokens(
      decoded.id,
      access_token, // Access Token MỚI
      token, // Refresh Token CŨ (giữ nguyên)
      60 * 60, // Access Exp
      7 * 24 * 60 * 60 // Refresh Exp
    );

    return {
      id: decoded.id,
      access_token,
      expirationTime,
    };
  }

  decode = (token: string) => {
    try {
      return jwt.decode(token);
    } catch (error) {
      throw error;
    }
  };
}
