import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
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
    const decode = jwt.verify(accessToken, process.env.ACCESS_TOKEN as string);
    if (typeof decode !== "string") {
      req.user = decode as Express.User;
    }
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
      access_token: string;
      expirationTime: number;
    }
  | { status: string; message: string }
> => {
  return new Promise((resolve) => {
    jwt.verify(token, process.env.REFRESH_TOKEN, async (err, user: any) => {
      if (err) {
        return resolve({ status: "ERR", message: "The authentication failed" });
      }
      const access_token = generalAccessToken({ id: user.id, role: user.role });

      const expirationTime = Date.now() + 60 * 60 * 1000;

      resolve({
        access_token,
        expirationTime,
      });
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
