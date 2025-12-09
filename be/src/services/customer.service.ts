import bcrypt from "bcrypt";
import otpGenerator from "otp-generator";
import { sendOtpEmail } from "./email.service";
import { CloudinaryAsset } from "@/@types/interface";
import { ArrangeType } from "@/@types/type";
import { ModelCustomer } from "@/models/user";
import deleteOldFile from "@/utils/deleteOldFile.util";
import { UserService } from "./user.service";
import { generalAccessToken, generalRefreshToken } from "@/services/auth.service";
import { OtpService } from "./otp.service";
import testEmail from "@/utils/testEmail";
import { formatDate } from "@/utils/formatDate";
import { UpdatePassword } from "@/@types/user.type";
import { redisClient } from "@/config/redis";
import { PrismaClient } from "@prisma/client";
import cloudinary from "@/config/cloudinary";
import { splitFullName } from "@/utils/fullNameSplit.util";
import { UserCacheService } from "./cache/userCache.service";
import { AuthCacheService } from "./cache/authCache.service";
import { Role } from "@/common/enums";

const prisma = new PrismaClient({
  log: ["query", "error"],
});
export class CustomerService {
  private userService = new UserService();
  private userCacheService = new UserCacheService(redisClient);
  private authCacheService = new AuthCacheService(redisClient);

  fetchMe(id: number): Promise<object> {
    return new Promise(async (resolve, reject) => {
      try {
        let existingUser = null;
        existingUser = await this.userCacheService.getUserById(id);

        if (!existingUser) {
          existingUser = await prisma.user.findUnique({
            where: { id: id, role: "customer" },
          });
          if (!existingUser) {
            return resolve({
              status: "ERR",
              message: "Customer not found",
            });
          } else {
            console.log("postgresql");
            await this.userCacheService.cacheUser(existingUser);
            resolve(existingUser);
          }
        } else {
          resolve(existingUser);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  fetch(id: number): Promise<object> {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await prisma.user.findUnique({
          where: { id: id, role: "customer" },
        });
        if (!user) {
          return resolve({
            status: "ERR",
            message: "Customer not found",
          });
        } else {
          resolve(user);
        }
      } catch (error) {
        console.log("Err Service.fetch", error);
        reject(error);
      }
    });
  }

  loginOAuthWithGoogle(profile: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const { id, emails, displayName, photos } = profile;
        const userEmail = emails[0].value;
        let access_token = "",
          refresh_token = "",
          expirationTime = 0;
        let existingUser = null;

        // A. Kiểm tra Redis bằng Email (Lookup Cache)
        let cachedUserId = await this.userCacheService.getUserByEmail(userEmail);

        if (!cachedUserId) {
          // B. Cache Miss -> Truy vấn DB
          // Nếu tìm thấy ID qua Email lookup (Cache Tham chiếu)
          existingUser = await this.userService.findByEmail(userEmail, Role.CUSTOMER);
          if (existingUser) {
            // C. Cache Load (Tải lại Cache)
            // Lấy data từ DB (existingUser) và SET lại vào Redis
            // Hàm setCachedUser này phải tạo cả key Email và key ID hệ thống
            await this.userCacheService.cacheUser(existingUser);
          }
        } else {
          existingUser = cachedUserId;
        }

        // --- BẮT ĐẦU LUỒNG XỬ LÝ CHÍNH (Đã có existingUser hoặc null) ---

        if (existingUser) {
          // LUỒNG: ĐÃ TỒN TẠI (Cache hoặc DB)
          if (existingUser.provider === "google") {
            access_token = generalAccessToken({ id: existingUser.id, role: "customer" });
            refresh_token = generalRefreshToken({ id: existingUser.id, role: "customer" });
            expirationTime = Date.now() + 60 * 60 * 1000;

            await this.authCacheService.cacheTokens(
              existingUser.id,
              access_token,
              refresh_token,
              60 * 60,
              60 * 60 * 24 * 7
            );

            return resolve({
              status: "OK",
              message: "Login success (Fast/DB)",
              id: existingUser.id,
              email: existingUser.email,
              avatar: existingUser.url_img,
              access_token: access_token,
              refresh_token: refresh_token,
              expirationTime,
            });
          } else {
            return reject({
              status: "ERR",
              action: "conflict",
              message: "Email already in use with a different login method",
            });
          }
        } else {
          // LUỒNG: ĐĂNG KÝ MỚI
          const googleImgUrl = photos[0].value;
          let cloudinaryResult = null;

          // Upload ảnh lên Cloudinary
          try {
            const cloudinaryAwait = await cloudinary.v2.uploader.upload(googleImgUrl, {
              folder: "book-bus-tickets/images/customers/avatar",
              public_id: `google_${id}`,
            });
            cloudinaryResult = cloudinaryAwait.secure_url;
          } catch (error) {
            console.warn("Cảnh báo: Tải ảnh Cloudinary thất bại. Dùng URL gốc Google.", error);
          }

          const { firstName, lastName } = splitFullName(displayName);

          const newUserRecord = await prisma.user.create({
            data: {
              email: emails[0].value,
              first_name: firstName,
              last_name: lastName,
              url_img: cloudinaryResult,
              url_public_img: `book-bus-tickets/customers/google_${id}`, // profile.id
              provider: "google",
              role: "customer",
              status: "active",
            },
          });
          const newUserId = newUserRecord.id;

          // Lưu thông tin người dùng mới vào Cả hai Redis cache ngay lập tức
          // Hàm này sẽ tự động tạo Cache Chính (dùng ID) và Cache Tham chiếu (dùng Email)
          await this.userCacheService.cacheUser(newUserRecord);

          access_token = generalAccessToken({ id: newUserId, role: "customer" });
          refresh_token = generalRefreshToken({ id: newUserId, role: "customer" });
          expirationTime = Date.now() + 60 * 60 * 1000;

          await this.authCacheService.cacheTokens(
            newUserId,
            access_token,
            refresh_token,
            60 * 60,
            60 * 60 * 24 * 7
          );

          resolve({
            status: "OK",
            message: "Register and Login success",
            id: newUserId,
            email: newUserRecord.email,
            avatar: newUserRecord.url_img,
            access_token: access_token,
            refresh_token: refresh_token,
            expirationTime,
          });
        }
      } catch (error) {
        reject(error);
      }
    });
  }
}
