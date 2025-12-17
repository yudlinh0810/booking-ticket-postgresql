import { redisClient } from "@/config/redis";
import { PrismaClient } from "@prisma/client";
import { UpdateUserMapper } from "@/dto/user";
import { CloudinaryAsset } from "@/@types/interface";
import deleteOldFile from "@/utils/deleteOldFile.util";
import { UserCacheService } from "./cache/userCache.service";
import { Role } from "@/common/enums";
import { generateRandomString } from "@/utils/generateRandomString";
import { EmailService } from "./email.service";
import { hashPassword } from "@/utils/hashPassword";

const userBaseSelect = {
  id: true,
  email: true,
  role: true,
  status: true,
  first_name: true,
  last_name: true,
  phone: true,
  address: true,
  url_img: true,
  url_public_img: true,
  date_birth: true,
  sex: true,
  created_at: true,
};

const coDriverSelect = {
  ...userBaseSelect,
  start_work_date: true,
  company_id: true,
  current_location_id: true,
};

const driverSelect = {
  ...coDriverSelect,
  license_number: true,
};

const managerSelect = {
  ...userBaseSelect,
  company_id: true,
};
export class UserService {
  private prisma = new PrismaClient();
  private userCacheService = new UserCacheService(redisClient);
  private emailService = new EmailService();

  async getTotal(): Promise<number> {
    const count = await this.prisma.user.count({
      where: { is_deleted: false },
    });
    return count;
  }

  async findByEmail(email: string, role: Role): Promise<object | null> {
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

  async fetch(id: number, role: Role): Promise<object | object> {
    const existingInRedis = await this.userCacheService.getUserById(id);
    if (existingInRedis) {
      return existingInRedis;
    }
    let selectOptions: any = {};
    switch (role) {
      case "admin":
      case "super_admin":
        selectOptions = undefined;
        break;
      case "co_driver":
        selectOptions = coDriverSelect;
        break;
      case "driver":
        selectOptions = driverSelect;
        break;
      case "manager":
        selectOptions = managerSelect;
        break;
      default:
        selectOptions = userBaseSelect;
    }
    // Nếu là role khác, ta dùng select
    const queryArgs: any = {
      where: { id: id, is_deleted: false },
    };

    if (!selectOptions) {
      // Super_Admin - Admin: Lấy hết trừ password
      queryArgs.omit = { password: true };
    } else {
      queryArgs.select = selectOptions;
    }

    const detailUser = await this.prisma.user.findUnique(queryArgs);

    if (!detailUser) {
      throw new Error("User not found or deleted");
    } else {
      if (role === "admin" || role === "super_admin") {
        return detailUser;
      } else {
        await this.userCacheService.cacheUser(detailUser);
      }
    }
    return detailUser;
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.prisma.user.delete({ where: { id: id } });
      return true;
    } catch (error) {
      throw "Error delete user.";
    }
  }

  async updateByRole<T extends keyof UpdateUserMapper>(
    id: number,
    role: T,
    data: UpdateUserMapper[T],
    newAvatar?: CloudinaryAsset
  ): Promise<any> {
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

      return { status: "OK", data: updatedUser };
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
        throw "Không tìm thấy user để update!";
      }
      throw error;
    }
  }

  async resetPassword(email: string) {
    try {
      const checkUser = await this.prisma.user.findUnique({
        where: { email: email, is_deleted: false },
      });

      if (!checkUser) {
        throw new Error("User not found");
      } else {
        const linkReset = generateRandomString(50);
        const updateResetLink = await this.prisma.passwordResetToken.create({
          data: {
            user_id: checkUser.id,
            token: linkReset,
            expires_at: new Date(Date.now() + 60 * 15 * 1000), // 15'
          },
        });
        if (updateResetLink) {
          const sendLinkResetPassword = await this.emailService.sendLinkResetPassword(
            checkUser.email,
            linkReset
          );
          if (!sendLinkResetPassword) {
            throw new Error("Failed to send reset link email");
          }
          return {
            message: "Reset link created successfully",
          };
        } else {
          throw new Error("Reset link creation failed");
        }
      }
    } catch (error) {
      throw error;
    }
  }

  async confirmResetPassword(token: string, newPassword: string) {
    try {
      const resetTokenRecord = await this.prisma.passwordResetToken.findFirst({
        where: {
          token: token,
          is_user: false,
          // expires_at: {
          //   gte: new Date()
          // }
        },
      });

      if (!resetTokenRecord) {
        throw new Error("Invalid or expired reset token");
      }

      const now = new Date();
      if (resetTokenRecord.expires_at < now) {
        await this.prisma.passwordResetToken.deleteMany({
          where: { id: resetTokenRecord.id },
        });
        throw new Error("Reset token has expired");
      }

      const hashedPassword = await hashPassword(newPassword, 10);
      await this.prisma.$transaction([
        this.prisma.user.update({
          where: { id: resetTokenRecord.user_id },
          data: { password: hashedPassword },
        }),
        this.prisma.passwordResetToken.delete({
          where: { id: resetTokenRecord.id },
        }),
      ]);

      return {
        message: "Password has been reset successfully",
      };
    } catch (error) {
      throw error;
    }
  }
}
