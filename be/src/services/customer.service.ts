import { UserService } from "./user.service";
import { redisClient } from "@/config/redis";
import { PrismaClient } from "@prisma/client";
import cloudinary from "@/config/cloudinary";
import { splitFullName } from "@/utils/fullNameSplit.util";
import { UserCacheService } from "./cache/userCache.service";
import { AuthCacheService } from "./cache/authCache.service";
import { Role } from "@/common/enums";
import { TokenPayload } from "google-auth-library";
import { AuthService } from "./auth.service";

const prisma = new PrismaClient({
  log: ["query", "error"],
});
export class CustomerService {
  private userService = new UserService();
  private userCacheService = new UserCacheService(redisClient);
  private authCacheService = new AuthCacheService(redisClient);
  private authService = new AuthService();

  async getProfile(id: number): Promise<{ status: string; message: string; data?: object }> {
    try {
      let existingUser = null;
      existingUser = await this.userCacheService.getUserById(id);

      if (!existingUser) {
        existingUser = await prisma.user.findUnique({
          where: { id: id, role: "customer", is_deleted: false },
          select: {
            id: true,
            email: true,
            first_name: true,
            last_name: true,
            phone: true,
            address: true,
            url_img: true,
            url_public_img: true,
            date_birth: true,
            sex: true,
          },
        });
        if (!existingUser) {
          return {
            status: "ERR",
            message: "Customer not found",
          };
        } else {
          await this.userCacheService.cacheUser(existingUser);
          return {
            status: "OK",
            message: "Fetch profile success",
            data: existingUser,
          };
        }
      } else {
        return {
          status: "OK",
          message: "Fetch profile success",
          data: existingUser,
        };
      }
    } catch (error) {
      return error;
    }
  }

  async fetch(id: number): Promise<object> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: id, role: "customer" },
      });
      if (!user) {
        return {
          status: "ERR",
          message: "Customer not found",
        };
      } else {
        return user;
      }
    } catch (error) {
      console.log("Err Service.fetch", error);
      return error;
    }
  }

  async loginOAuthWithGoogle(googlePayload: TokenPayload): Promise<{
    status: string;
    message: string;
    action?: string;
    user?: {
      id?: number;
      email?: string;
      first_name?: string;
      last_name?: string;
      avatar?: string;
    };
    tokenAuth?: {
      access_token?: string;
      refresh_token?: string;
      expirationTime?: number;
    };
  }> {
    try {
      // sub là Google ID duy nhất
      const { sub: googleId, email, name, picture } = googlePayload;

      if (!email) return { status: "ERR", message: "No email provided by Google" };

      let access_token = "",
        refresh_token = "",
        expirationTime = 0;
      let existingUser = null;

      // A. Kiểm tra Redis bằng Email (Giữ nguyên logic cũ của bạn)
      let cachedUserId = await this.userCacheService.getUserByEmail(email);

      if (!cachedUserId) {
        // B. Cache Miss -> Truy vấn DB
        existingUser = await this.userService.findByEmail(email, Role.CUSTOMER);
        if (existingUser) {
          // C. Cache Load
          await this.userCacheService.cacheUser(existingUser);
        }
      } else {
        existingUser = cachedUserId;
      }

      if (existingUser) {
        if (existingUser.provider === "google") {
          access_token = this.authService.generalAccessToken({
            id: existingUser.id,
            role: "customer",
          });
          refresh_token = this.authService.generalRefreshToken({
            id: existingUser.id,
            role: "customer",
          });
          expirationTime = Date.now() + 60 * 60 * 1000;

          await this.authCacheService.cacheTokens(
            existingUser.id,
            access_token,
            refresh_token,
            60 * 60,
            60 * 60 * 24 * 7
          );

          return {
            status: "OK",
            message: "Login success",
            user: {
              id: existingUser.id,
              email: existingUser.email,
              first_name: existingUser.first_name,
              last_name: existingUser.last_name,
              avatar: existingUser.url_img,
            },
            tokenAuth: {
              access_token: access_token,
              refresh_token: refresh_token,
              expirationTime,
            },
          };
        } else {
          return {
            status: "ERR",
            action: "conflict",
            message: "Email already in use with a different login method",
          };
        }
      } else {
        let cloudinaryResult = null;
        try {
          // picture là URL ảnh avatar từ Google Payload
          if (picture) {
            const cloudinaryAwait = await cloudinary.v2.uploader.upload(picture, {
              folder: "book-bus-tickets/images/customers/avatar",
              public_id: `google_${googleId}`, // Dùng googleId (sub)
            });
            cloudinaryResult = cloudinaryAwait.secure_url;
          }
        } catch (error) {
          console.warn("Cảnh báo: Tải ảnh Cloudinary thất bại. Dùng URL gốc Google.", error);
          cloudinaryResult = picture; // Fallback về ảnh gốc google nếu upload lỗi
        }

        // name trong payload là full name
        const { firstName, lastName } = splitFullName(name || "");

        const newUserRecord = await prisma.user.create({
          data: {
            email: email,
            first_name: firstName,
            last_name: lastName,
            url_img: cloudinaryResult,
            url_public_img: `book-bus-tickets/customers/google_${googleId}`,
            date_birth: new Date(),
            provider: "google",
            role: "customer",
            status: "active",
          },
        });
        const newUserId = newUserRecord.id;

        // Lưu Cache
        await this.userCacheService.cacheUser(newUserRecord);

        access_token = this.authService.generalAccessToken({ id: newUserId, role: "customer" });
        refresh_token = this.authService.generalRefreshToken({ id: newUserId, role: "customer" });
        expirationTime = Date.now() + 60 * 60 * 1000;

        await this.authCacheService.cacheTokens(
          newUserId,
          access_token,
          refresh_token,
          60 * 60,
          60 * 60 * 24 * 7
        );

        return {
          status: "OK",
          message: "Register and Login success",
          user: {
            id: newUserId,
            email: newUserRecord.email,
            avatar: newUserRecord.url_img,
          },
          tokenAuth: {
            access_token: access_token,
            refresh_token: refresh_token,
            expirationTime,
          },
        };
      }
    } catch (error) {
      return error;
    }
  }
}
