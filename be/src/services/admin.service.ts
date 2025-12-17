import bcrypt from "bcrypt";
import { ArrangeType } from "@/@types/type";

import { UserCacheService } from "./cache/userCache.service";
import { redisClient } from "@/config/redis";
import { CreateBaseUserDto } from "@/users/dto/create/create-base-user.dto";
import { UpdateAdminDto } from "@/users/dto/update/update-admin.dto";
import { generateRandomString } from "@/utils/generateRandomString";
import { hashPassword } from "@/utils/hashPassword";
import { EmailService } from "./email.service";
import prisma from "@/config/prisma";

export class AdminService {
  protected userCacheService = new UserCacheService(redisClient);
  protected emailService = new EmailService();

  async total(): Promise<number> {
    try {
      const result = await prisma.user.findMany({
        where: {
          role: "admin",
          is_deleted: false,
        },
      });
      return result.length;
    } catch (error) {
      throw error;
    }
  }

  totalPage(total: number, limit: number): number {
    return Math.ceil(total / limit);
  }

  async getAllPagination(page: number = 1, limit: number = 10, arrangeType?: ArrangeType) {
    const onmitAdmin = {
      company_id: true,
      current_location_id: true,
      start_work_date: true,
      license_number: true,
      password: true,
    };

    // Tính số lượng bản ghi cần bỏ qua
    const skip = (page - 1) * limit;

    const totalCount = await this.total();
    const totalPage = Math.ceil(totalCount / limit);

    const adminList = await prisma.user.findMany({
      omit: onmitAdmin,
      where: { is_deleted: false },

      take: limit,
      skip: skip,

      orderBy: {
        id: arrangeType === "DESC" ? "desc" : "asc",
      },
    });

    return {
      total: totalCount,
      totalPage,
      currentPage: page,
      limit,
      data: adminList,
    };
  }

  async add(data: CreateBaseUserDto) {
    try {
      const saltPassword = await hashPassword(data.password);
      const newAdmin = await prisma.user.create({
        data: {
          ...data,
          password: saltPassword,
          role: "admin",
        },
      });

      if (newAdmin.id) {
        return {
          message: "Create Admin Successfully",
        };
      } else {
        throw new Error("Create Admin Failed");
      }
    } catch (error) {
      throw error;
    }
  }

  // Update Profile Admin
  async updateAdminDetails(id: number, data: UpdateAdminDto) {
    try {
      const updateAdmin = await prisma.user.update({
        where: { id },
        data: {
          ...data,
          role: "admin",
        },
      });

      if (updateAdmin) {
        return {
          message: "Update Admin Successfully",
          data: updateAdmin,
        };
      } else {
        throw new Error("Update Admin Failed");
      }
    } catch (error) {
      throw error;
    }
  }

  async updateAdminPassword(id: number, passwordOld: string, newPassword: string) {
    try {
      const getPassword = await prisma.user.findUnique({
        where: { id: id, is_deleted: false },
        select: { password: true },
      });

      if (!getPassword) {
        throw new Error("Admin not found");
      } else {
        const comparePassword = await bcrypt.compare(passwordOld, getPassword.password);
        if (!comparePassword) {
          throw new Error("Old password is incorrect");
        } else {
          const saltPassword = await hashPassword(newPassword, 10);
          const updatePassword = await prisma.user.update({
            where: { id: id },
            data: { password: saltPassword },
          });
          if (updatePassword) {
            return {
              message: "Update password successfully",
            };
          } else {
            throw new Error("Update password failed");
          }
        }
      }
    } catch (error) {
      throw error;
    }
  }

  async resetAdminPassword(email: string) {
    try {
      const checkAdmin = await prisma.user.findUnique({
        where: { email: email, is_deleted: false },
      });

      if (!checkAdmin) {
        throw new Error("Admin not found");
      } else {
        const linkReset = generateRandomString(50);
        const updateResetLink = await prisma.passwordResetToken.create({
          data: {
            user_id: checkAdmin.id,
            token: linkReset,
            expires_at: new Date(Date.now() + 60 * 15 * 1000), // 15'
          },
        });
        if (updateResetLink) {
          const sendLinkResetPassword = await this.emailService.sendLinkResetPassword(
            checkAdmin.email,
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

  async confirmResetAdminPassword(token: string, newPassword: string) {
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

      const saltPassword = await hashPassword(newPassword, 10);
      const updatePassword = await prisma.user.update({
        where: { id: resetTokenRecord.user_id },
        data: { password: saltPassword },
      });

      if (updatePassword) {
        await prisma.passwordResetToken.deleteMany({
          where: { id: resetTokenRecord.id },
        });
        return {
          message: "Password has been reset successfully",
        };
      } else {
        throw new Error("Failed to reset password");
      }
    } catch (error) {
      throw error;
    }
  }
}
