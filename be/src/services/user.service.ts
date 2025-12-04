import bcrypt from "bcrypt";
import { generalAccessToken, generalRefreshToken } from "../services/auth.service";
import { redisClient } from "../config/redis";
import { PrismaClient, Provider, Role, User } from "@prisma/client";
import { UpdateUserMapper } from "../dto/user";
import { CloudinaryAsset } from "../@types/interface";
import deleteOldFile from "../utils/deleteOldFile.util";
import { UserCacheService } from "./cache/userCache.service";

export class UserService {
  private db;
  private prisma = new PrismaClient();
  private userCacheService = new UserCacheService(redisClient);
  constructor(db: any) {
    this.db = db;
  }

  async getTotalUser(): Promise<number> {
    const count = await this.prisma.user.count({
      where: { is_deleted: false },
    });
    return count;
  }

  async findUserByEmail(email: string, role: Role): Promise<User | null> {
    try {
      return this.prisma.user.findFirst({
        where: { email, role: role, is_deleted: false },
      });
    } catch {
      throw "Err find user by email";
    }
  }

  async findImageById(id: number) {
    try {
      return this.prisma.user.findFirst({
        where: { id },
        select: {
          url_img: true,
          url_public_img: true,
        },
      });
    } catch (error) {
      throw "Err find url_public_img by id";
    }
  }

  async fetchUser(email: string, provider: Provider, role: Role): Promise<User> {
    const detailUser = await this.prisma.user.findFirst({
      where: { email, provider, role, is_deleted: false },
    });
    if (!detailUser) {
      throw new Error("User not found or deleted");
    }
    return detailUser;
  }

  delete(id: number): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.prisma.user.delete({ where: { id: id } });
        resolve({
          status: "OK",
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  updateUserByRole<T extends keyof UpdateUserMapper>(
    id: number,
    role: T,
    data: UpdateUserMapper[T],
    newAvatar?: CloudinaryAsset
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await this.findImageById(id);

        const hasOldImage = !!(user.url_public_img && user.url_public_img !== "");
        const hasNewImage = !!(newAvatar?.secure_url && newAvatar?.secure_url !== user.url_img);
        const shouldDeleteOldImage = hasOldImage && hasNewImage;

        const updatedUser = await this.prisma.user.update({
          where: { id },
          data: {
            ...data,
            url_img: newAvatar?.secure_url || user.url_img,
            url_public_img: newAvatar?.public_id || user.url_public_img,
            date_birth: data.date_birth ? new Date(data.date_birth + "T00:00:00.000Z") : undefined,
          },
        });

        // Cập nhật Redis cache
        await this.userCacheService.cacheUser(updatedUser);

        if (shouldDeleteOldImage) {
          try {
            await deleteOldFile(user.url_public_img, "image");
          } catch (err) {
            console.error("Failed to delete old image:", err);
          }
        }

        resolve({ status: "OK", data: updatedUser });
      } catch (error: any) {
        if (data.url_public_img) {
          let publicId: string | undefined;

          if (typeof data.url_public_img === "string") {
            publicId = data.url_public_img;
          } else if ("set" in data.url_public_img && typeof data.url_public_img.set === "string") {
            publicId = data.url_public_img.set;
          }

          if (publicId) {
            await deleteOldFile(publicId, "image");
          }
        }

        if (error.code === "P2025") {
          reject("Không tìm thấy user để update!");
        }
        reject(error);
      }
    });
  }
}
