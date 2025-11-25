import bcrypt from "bcrypt";
import { generalAccessToken, generalRefreshToken } from "../services/auth.service";
import { redisClient } from "../config/redis";
import { PrismaClient, Provider, Role, User } from "@prisma/client";
import { UpdateUserMapper } from "../dto/user";
import { CloudinaryAsset } from "../@types/interface";
import deleteOldFile from "../utils/deleteOldFile.util";
import { RedisService } from "./redis.service";

interface LoginType {
  email: string;
  password: string;
}

interface UserType {
  id: number;
  email: string;
  fullName: string;
  phone: string;
  dateBirth: string;
  urlImg: string;
  urlPublicImg: string;
  password?: string;
  role?: string;
}

export class UserService {
  private db;
  private prisma = new PrismaClient();
  private redis = new RedisService(redisClient);
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

  async checkUser(email: string): Promise<boolean> {
    const [rows] = await this.db.execute(
      "select count(email) as countUser from user where email = ?",
      [email]
    );
    const countUser = (rows as any)[0].countUser;
    return countUser > 0 ? true : false;
  }

  async getAdminByEmail(email: string): Promise<any> {
    try {
      const [rows] = await this.db.execute(
        "select email, full_name as fullName, password, role from user where email = ? and role = 'admin'",
        [email]
      );
      return rows[0];
    } catch (err) {
      console.error("Query error:", err);
    }
  }

  async getCustomerByEmail(email: string): Promise<any> {
    try {
      const [rows] = await this.db.execute(
        `select id, email, full_name as fullName, phone, date_birth as dateBirth, url_img as urlImg,
         url_public_img as urlPublicImg, password, provider, role from user where email = ? and role = 'customer'`,
        [email]
      );
      return rows[0];
    } catch (err) {
      console.error("Query error:", err);
    }
  }
  async getUser(id: number): Promise<any> {
    try {
      const [rows] = await this.db.execute(
        `select id, email, full_name as fullName, phone, role from user where id = ?`,
        [id]
      );
      return rows[0];
    } catch (err) {
      console.error("Query error:", err);
    }
  }

  async getDriverByEmail(email: string): Promise<any> {
    try {
      const [rows] = await this.db.execute(
        "select email, password, role from user where email = ? and role = 'driver'",
        [email]
      );
      return rows[0];
    } catch (err) {
      console.error("Query error:", err);
    }
  }

  async getCoDriverByEmail(email: string): Promise<any> {
    try {
      const [rows] = await this.db.execute(
        "select email, password, role from user where email = ? and role = 'co-driver'",
        [email]
      );
      return rows[0];
    } catch (err) {
      console.error("Query error:", err);
    }
  }

  loginByAdmin(userLogin: LoginType): Promise<
    | {
        status: string;
        data: object;
        access_token: string;
        expirationTime: number;
        refresh_token: string;
      }
    | {
        status: string;
        message: string;
      }
  > {
    return new Promise(async (resolve, reject) => {
      try {
        const checkPerson = await this.getAdminByEmail(userLogin.email);
        if (!checkPerson) {
          resolve({
            status: "ERR",
            message: "The admin is not defined",
          });
        } else {
          const comparePass = await bcrypt.compareSync(userLogin.password, checkPerson.password);
          if (!comparePass) {
            resolve({
              status: "ERR",
              message: "Password error",
            });
          } else {
            const detailAdmin = {
              email: checkPerson?.email,
              fullName: checkPerson?.fullName,
              role: checkPerson?.role,
            };

            const access_token = generalAccessToken({
              id: checkPerson?.email,
              role: checkPerson?.role,
            });

            const expirationTime = Date.now() + 60 * 60 * 1000;

            const refresh_token = generalRefreshToken({
              id: checkPerson?.email,
              role: checkPerson?.role,
            });

            // Note: save session in redis
            const sessionKey = `session_${checkPerson?.email}`;
            const refreshKey = `refresh_${checkPerson?.email}`;
            await redisClient.set(sessionKey, access_token, { EX: 60 * 60 });
            await redisClient.set(refreshKey, refresh_token, { EX: 60 * 60 * 24 });

            resolve({
              status: "OK",
              data: detailAdmin,
              access_token,
              refresh_token,
              expirationTime,
            });
          }
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  loginByCustomer(userLogin: LoginType): Promise<
    | {
        status: string;
        data: UserType;
        access_token: string;
        expirationTime: number;
        refresh_token: string;
      }
    | {
        status: string;
        message: string;
      }
  > {
    return new Promise(async (resolve, reject) => {
      try {
        const checkPerson = await this.getCustomerByEmail(userLogin.email);
        if (!checkPerson) {
          resolve({
            status: "ERR",
            message: "Đăng nhập thất bại",
          });
          return;
        } else {
          const comparePass = await bcrypt.compareSync(userLogin.password, checkPerson.password);
          if (!comparePass) {
            resolve({
              status: "ERR",
              message: "Đăng nhập thất bại",
            });
          } else {
            const detailCustomer: UserType = {
              id: checkPerson?.id,
              email: checkPerson?.email,
              fullName: checkPerson?.fullName,
              phone: checkPerson?.phone,
              dateBirth: checkPerson?.dateBirth,
              urlImg: checkPerson?.urlImg,
              urlPublicImg: checkPerson?.urlPublicImg,
            };

            console.log("customer", detailCustomer);

            const access_token = generalAccessToken({
              id: checkPerson?.email,
              role: checkPerson?.role,
            });

            const expirationTime = Date.now() + 60 * 60 * 1000;

            const refresh_token = generalRefreshToken({
              id: checkPerson?.email,
              role: checkPerson?.role,
            });

            // Note: save session in redis
            const sessionKey = `session_${checkPerson?.email}`;
            const refreshKey = `refresh_${checkPerson?.email}`;
            await redisClient.set(sessionKey, access_token, { EX: 60 * 60 });
            await redisClient.set(refreshKey, refresh_token, { EX: 60 * 60 * 24 * 7 });

            resolve({
              status: "OK",
              data: detailCustomer,
              access_token,
              refresh_token,
              expirationTime,
            });
          }
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  loginByDriver(userLogin: LoginType): Promise<
    | {
        access_token: string;
        status: string;
        expirationTime: number;
        refresh_token: string;
      }
    | {
        status: string;
        message: string;
      }
  > {
    return new Promise(async (resolve, reject) => {
      try {
        const checkPerson = await this.getDriverByEmail(userLogin.email);
        if (!checkPerson) {
          resolve({
            status: "ERR",
            message: "The driver is not defined",
          });
        } else {
          const comparePass = await bcrypt.compareSync(userLogin.password, checkPerson.password);
          if (!comparePass) {
            resolve({
              status: "ERR",
              message: "Password error",
            });
          } else {
            const access_token = generalAccessToken({
              id: checkPerson?.email,
              role: checkPerson?.role,
            });

            const expirationTime = Date.now() + 60 * 60 * 1000;

            const refresh_token = generalRefreshToken({
              id: checkPerson?.email,
              role: checkPerson?.role,
            });
            // Note: save session in redis
            const sessionKey = `session_${checkPerson?.email}`;
            const refreshKey = `refresh_${checkPerson?.email}`;
            await redisClient.set(sessionKey, access_token, { EX: 60 * 60 });
            await redisClient.set(refreshKey, refresh_token, { EX: 60 * 60 * 24 * 7 });

            resolve({
              status: "OK",
              access_token,
              refresh_token,
              expirationTime,
            });
          }
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  loginByCoDriver(userLogin: LoginType): Promise<
    | {
        access_token: string;
        status: string;
        expirationTime: number;
        refresh_token: string;
      }
    | {
        status: string;
        message: string;
      }
  > {
    return new Promise(async (resolve, reject) => {
      try {
        const checkPerson = await this.getCoDriverByEmail(userLogin.email);
        if (!checkPerson) {
          resolve({
            status: "ERR",
            message: "The co-driver is not defined",
          });
        } else {
          const comparePass = await bcrypt.compareSync(userLogin.password, checkPerson.password);
          if (!comparePass) {
            resolve({
              status: "ERR",
              message: "Password error",
            });
          } else {
            const access_token = generalAccessToken({
              id: checkPerson?.email,
              role: checkPerson?.role,
            });

            const refresh_token = generalRefreshToken({
              id: checkPerson?.email,
              role: checkPerson?.role,
            });

            const expirationTime = Date.now() + 60 * 60 * 1000;

            // Note: save session in redis
            const sessionKey = `session_${checkPerson?.email}`;
            const refreshKey = `refresh_${checkPerson?.email}`;
            await redisClient.set(sessionKey, access_token, { EX: 60 * 60 });
            await redisClient.set(refreshKey, refresh_token, { EX: 60 * 60 * 24 * 7 });

            resolve({
              status: "OK",
              access_token,
              refresh_token,
              expirationTime,
            });
          }
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  delete(id: number): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.db.execute("call delete_user(?)", [id]);
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
        await this.redis.setCachedUser(updatedUser, 60 * 60 * 24 * 7);

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
