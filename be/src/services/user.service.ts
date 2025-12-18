import { redisClient } from "@/config/redis";
import { UpdateUserMapper } from "@/dto/user";
import { CloudinaryAsset } from "@/@types/interface";
import deleteOldFile from "@/utils/deleteOldFile.util";
import { UserCacheService } from "./cache/userCache.service";
import { Role } from "@/common/enums";
import { generateRandomString } from "@/utils/generateRandomString";
import { EmailService } from "./email.service";
import { hashPassword } from "@/utils/hashPassword";
import prisma from "@/config/prisma";
import { executeWithRetry } from "@/utils/prismaRetry.util";
import { ArrangeType } from "@/@types/type";

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
  private userCacheService = new UserCacheService(redisClient);
  private emailService = new EmailService();

  getTotal = async (): Promise<number> => {
    return executeWithRetry(async () => {
      return await prisma.user.count({
        where: { is_deleted: false },
      });
    });
  };

  findByEmail = async (email: string, role: Role): Promise<object | null> => {
    try {
      return await executeWithRetry(async () => {
        return await prisma.user.findFirst({
          where: { email, role: role, is_deleted: false },
        });
      });
    } catch {
      throw "Err find user by email";
    }
  };

  findImageById = async (id: number) => {
    try {
      return await executeWithRetry(async () => {
        return await prisma.user.findFirst({
          where: { id },
          select: {
            url_img: true,
            url_public_img: true,
          },
        });
      });
    } catch (error) {
      throw "Err find url_public_img by id";
    }
  };

  fetch = async (id: number, role: Role): Promise<object | object> => {
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

    const queryArgs: any = {
      where: { id: id, is_deleted: false },
    };

    if (!selectOptions) {
      queryArgs.omit = { password: true };
    } else {
      queryArgs.select = selectOptions;
    }

    const detailUser = await executeWithRetry(async () => {
      return await prisma.user.findUnique(queryArgs);
    });

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
  };

  delete = async (id: number): Promise<boolean> => {
    try {
      await executeWithRetry(async () => {
        await prisma.user.delete({ where: { id: id } });
      });
      return true;
    } catch (error) {
      throw "Error delete user.";
    }
  };

  updateByRole = async <T extends keyof UpdateUserMapper>(
    id: number,
    role: T,
    data: UpdateUserMapper[T],
    newAvatar?: CloudinaryAsset
  ): Promise<any> => {
    try {
      const user = await this.findImageById(id);

      const hasOldImage = !!(user.url_public_img && user.url_public_img !== "");
      const hasNewImage = !!(newAvatar?.secure_url && newAvatar?.secure_url !== user.url_img);
      const shouldDeleteOldImage = hasOldImage && hasNewImage;

      const updatedUser = await executeWithRetry(async () => {
        return await prisma.user.update({
          where: { id },
          data: {
            ...data,
            url_img: newAvatar?.secure_url || user.url_img,
            url_public_img: newAvatar?.public_id || user.url_public_img,
            date_birth: data.date_birth ? new Date(data.date_birth + "T00:00:00.000Z") : undefined,
          },
        });
      });

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
  };

  resetPassword = async (email: string) => {
    return executeWithRetry(async () => {
      try {
        const checkUser = await prisma.user.findUnique({
          where: { email: email, is_deleted: false },
        });

        if (!checkUser) {
          throw new Error("User not found");
        }

        const linkReset = generateRandomString(50);
        const updateResetLink = await prisma.passwordResetToken.upsert({
          where: { user_id: checkUser.id },
          update: {
            token: linkReset,
            expires_at: new Date(Date.now() + 15 * 60 * 1000), // 15 phút
          },
          create: {
            user_id: checkUser.id,
            token: linkReset,
            expires_at: new Date(Date.now() + 15 * 60 * 1000),
          },
        });

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
      } catch (error) {
        throw error;
      }
    });
  };

  confirmResetPassword = async (token: string, newPassword: string) => {
    return executeWithRetry(async () => {
      try {
        const resetTokenRecord = await prisma.passwordResetToken.findFirst({
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
          await prisma.passwordResetToken.deleteMany({
            where: { id: resetTokenRecord.id },
          });
          throw new Error("Reset token has expired");
        }

        const hashedPassword = await hashPassword(newPassword, 10);
        await prisma.$transaction([
          prisma.user.update({
            where: { id: resetTokenRecord.user_id },
            data: { password: hashedPassword },
          }),
          prisma.passwordResetToken.delete({
            where: { id: resetTokenRecord.id },
          }),
        ]);

        return {
          message: "Password has been reset successfully",
        };
      } catch (error) {
        throw error;
      }
    });
  };

  totalUserByRole = async (role: Role): Promise<number> => {
    try {
      const result = await prisma.user.findMany({
        where: {
          role: role,
          is_deleted: false,
        },
      });
      return result.length;
    } catch (error) {
      throw error;
    }
  };

  totalPageUserByRole = (total: number, limit: number): number => {
    return Math.ceil(total / limit);
  };
}
