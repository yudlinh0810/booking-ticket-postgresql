import bcrypt from "bcrypt";
import { generalAccessToken, generalRefreshToken } from "../services/auth.service";
import { redisClient } from "../config/redis";
import { PrismaClient, Provider, Role, User } from "@prisma/client";

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

const prisma = new PrismaClient();

export class UserService {
  private db;
  constructor(db: any) {
    this.db = db;
  }

  async getTotalUser(): Promise<number> {
    const count = await prisma.user.count({
      where: { is_deleted: false },
    });
    return count;
  }

  async findUserByEmail(email: string, role: Role): Promise<User | null> {
    return prisma.user.findFirst({
      where: { email, role: role, is_deleted: false },
    });
  }

  async fetchUser(email: string, provider: Provider, role: Role): Promise<User> {
    const detailUser = await prisma.user.findFirst({
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
}
