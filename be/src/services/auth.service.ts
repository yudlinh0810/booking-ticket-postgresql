import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { redisClient } from "../config/redis";
dotenv.config();

// Tạo Access Token
export const generalAccessToken = ({ id, role }: { id: string; role: string }): string => {
  return jwt.sign({ id, role }, process.env.ACCESS_TOKEN, { expiresIn: "1h" });
};

// Tạo Refresh Token
export const generalRefreshToken = ({ id, role }: { id: string; role: string }): string => {
  return jwt.sign({ id, role }, process.env.REFRESH_TOKEN, { expiresIn: "7d" });
};

// Xác minh Access Token
export const verifyAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
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
      id: string; //email
      role: "customer" | "admin" | "driver" | "co-driver";
    };

    if (!decode || !decode.id || !decode.role) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    // kiểm tra redis
    const sessionKey = `session_${decode.id}`;
    const storedAccessToken = await redisClient.get(sessionKey);

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
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Xác minh Refresh Token & cấp lại Access Token
export const verifyRefreshToken = (
  token: string
): Promise<
  | {
      id?: string; //email
      access_token: string;
      expirationTime: number;
    }
  | { status: string; message: string }
> => {
  return new Promise(async (resolve) => {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN as string) as {
      id: string; //email
      role: "customer" | "admin" | "driver" | "co-driver";
    };

    if (!decoded || !decoded.id) {
      return resolve({ status: "ERR", message: "Invalid token" });
    }

    // kiểm tra redis
    const refreshKey = `refresh_${decoded.id}`;
    const storedRefreshToken = await redisClient.get(refreshKey);

    if (!storedRefreshToken) {
      return resolve({ status: "ERR", message: "Session expired" });
    }

    if (storedRefreshToken !== token) {
      return resolve({
        status: "ERR",
        message: "Refresh token mismatch. Please log in again.",
      });
    }

    const access_token = generalAccessToken({ id: decoded.id, role: decoded.role });

    const expirationTime = Date.now() + 60 * 60 * 1000;

    const sessionKey = `session_${decoded.id}`;
    const a = await redisClient.set(sessionKey, access_token, { EX: 60 * 60 });

    resolve({
      id: decoded.id,
      access_token,
      expirationTime,
    });
  });
};

export const decode = (token: string) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    throw error;
  }
};
