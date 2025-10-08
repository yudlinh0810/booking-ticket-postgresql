import "express";
import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface User extends JwtPayload {
      email?: string;
      provider_id?: string;
      access_token?: string;
      refresh_token?: string;
    }
  }
}

export {};
