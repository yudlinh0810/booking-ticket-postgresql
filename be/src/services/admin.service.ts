import { ArrangeType } from "@/@types/type";
import { UserStatus } from "@/common/enums";
import prisma from "@/config/prisma";
import { CreateBaseUserDto } from "@/users/dto/create/create-base-user.dto";
import { UpdateAdminDto } from "@/users/dto/update/update-admin.dto";
import { hashPassword } from "@/utils";
import bcrypt from "bcrypt";

export class AdminService {
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

  async getAdminsPagination(
    filters: {
      username?: string;
      last_name?: string;
      first_name?: string;
      email?: string;
      phone?: string;
      status?: UserStatus;
    },
    page: number = 1,
    limit: number = 10,
    arrangeType?: ArrangeType
  ) {
    try {
      const onmitAdmin = {
        company_id: true,
        current_location_id: true,
        start_work_date: true,
        license_number: true,
        password: true,
      };

      const whereCondition: any = {
        is_deleted: false,
        role: "admin",
      };

      if (filters.email) {
        whereCondition.email = { contains: filters.email, mode: "insensitive" };
      }

      // Tính số lượng bản ghi cần bỏ qua
      const skip = (page - 1) * limit;

      const totalCount = await this.total();
      const totalPage = Math.ceil(totalCount / limit);

      const adminList = await prisma.user.findMany({
        omit: onmitAdmin,
        where: {},

        take: limit,
        skip: skip,

        orderBy: {
          id: arrangeType === "desc" ? "desc" : "asc",
        },
      });

      return {
        total: totalCount,
        totalPage,
        currentPage: page,
        limit,
        data: adminList,
      };
    } catch (error) {
      throw error;
    }
  }

  async create(data: CreateBaseUserDto) {
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
}
