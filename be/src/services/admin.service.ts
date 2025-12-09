import bcrypt from "bcrypt";
import { ArrangeType } from "@/@types/type";
import { addAdminDTO } from "@/dto/user/admin.dto";
import { UserCacheService } from "./cache/userCache.service";
import { redisClient } from "@/config/redis";
import { PrismaClient } from "@prisma/client";

type OmitKeys =
  | "company_id"
  | "current_location_id"
  | "experience_years"
  | "license_number"
  | "password"
  | "is_deleted";

type UserOmitOptions = Partial<Record<OmitKeys, boolean>>;

export class AdminService {
  protected userCacheService = new UserCacheService(redisClient);
  protected prisma = new PrismaClient();

  async total(): Promise<number> {
    try {
      const result = await this.prisma.user.findMany({
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

  async getAllCursor(cursorId?: number, limit?: number, arrangeType?: ArrangeType) {
    const onmitAdmin: UserOmitOptions = {
      company_id: true,
      current_location_id: true,
      experience_years: true,
      license_number: true,
      password: true,
    };

    const totalCount = await this.total();
    const totalPage = this.totalPage(totalCount, limit);

    const adminList = await this.prisma.user.findMany({
      omit: onmitAdmin,
      where: { is_deleted: false },

      take: limit,

      ...(cursorId && {
        skip: 1,
        cursor: {
          id: cursorId,
        },
      }),

      orderBy: {
        id: arrangeType === "DESC" ? "desc" : "asc",
      },
    });

    // Lấy ID cuối cùng để làm cursor cho lần truy vấn tiếp theo
    const lastId = adminList[adminList.length - 1]?.id;

    return {
      total: totalCount,
      totalPage,
      data: adminList,
      nextCursor: lastId,
    };
  }

  // New Function Admin
  async add(data: addAdminDTO) {}
}
