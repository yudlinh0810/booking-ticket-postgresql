import bcrypt from "bcrypt";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import otpGenerator from "otp-generator";
import { bookBusTicketsDB } from "../config/db";
import { sendOtpEmail } from "./email.service";
import { CloudinaryAsset } from "../@types/interface";
import { ArrangeType, UserRegister } from "../@types/type";
import { ModelCustomer } from "../models/user";
import deleteOldFile from "../utils/deleteOldFile.util";
import { UserService } from "./user.service";
import { generalAccessToken, generalRefreshToken } from "../services/auth.service";
import { OtpService } from "./otp.service";
import testEmail from "../utils/testEmail";
import { formatDate } from "../utils/formatDate";
import { UpdatePassword } from "../@types/user.type";
import { redisClient } from "../config/redis";
import { PrismaClient, User } from "@prisma/client";
import cloudinary from "../config/cloudinary";
import { RedisService } from "./redis.service";
import { splitFullName } from "../utils/fullNameSplit.util";

const prisma = new PrismaClient({
  log: ["query", "error"],
});
export class CustomerService {
  private db;
  private redisService = new RedisService(redisClient);
  private userService = new UserService(bookBusTicketsDB);
  private otpService = new OtpService();

  constructor(db: any) {
    this.db = db;
  }

  async total(): Promise<number> {
    try {
      const query = "select count(*) as totalCustomerList from user where role = 'customer'";
      const [rows] = await this.db.execute(query);
      return (rows as RowDataPacket[])[0].totalCustomerList;
    } catch (error) {
      throw error;
    }
  }

  register(newCustomer: UserRegister): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const { email, password, fullName, confirmPassword } = newCustomer;

        if (password !== confirmPassword) {
          return resolve({
            status: "ERR",
            message: "Password and confirm password do not match",
          });
        }

        const checkPerson = await this.userService.checkUser(email);
        if (checkPerson) {
          return resolve({
            status: "E1",
            message: "Email này đã được sử dụng",
          });
        }

        const otp = otpGenerator.generate(6, {
          digits: true,
          lowerCaseAlphabets: false,
          upperCaseAlphabets: false,
          specialChars: false,
        });

        const passwordHash = await bcrypt.hash(password, 10);
        const insertOtp = await this.otpService.insertOtp({
          otp,
          email,
          passwordHash,
          fullName,
          role: "customer",
        });
        if (insertOtp.data.status === "ERR") {
          return resolve({
            status: "ERR",
            message: insertOtp.data.message,
          });
        }

        await sendOtpEmail({ email, otp });
        resolve({
          status: "OK",
          message: "Create OTP success",
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  insertOtp(email: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const [rows] = await this.db.execute("call fetchCustomerByEmail(?)", [email]);
        if (rows[0].length === 0) {
          resolve({
            status: "ERR",
            message: "Customer not found",
          });
          return;
        }

        const otp = otpGenerator.generate(6, {
          digits: true,
          lowerCaseAlphabets: false,
          upperCaseAlphabets: false,
          specialChars: false,
        });

        const insertOtp = await this.otpService.insertOtpForgotPassword({ otp, email });
        if (insertOtp.data.status === "ERR") {
          return resolve({
            status: "ERR",
            message: insertOtp.data.message,
          });
        }

        await sendOtpEmail({ email, otp });

        resolve({
          status: "OK",
          message: "Create OTP success",
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  sendOtp(email: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const otp = otpGenerator.generate(6, {
          digits: true,
          lowerCaseAlphabets: false,
          upperCaseAlphabets: false,
          specialChars: false,
        });

        const insertOtp = await this.otpService.insertOtpForgotPassword({ otp, email });
        if (insertOtp.data.status === "ERR") {
          return resolve({
            status: "ERR",
            message: insertOtp.data.message,
          });
        }

        await sendOtpEmail({ email, otp });

        resolve({
          status: "OK",
          message: "Create OTP success",
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  verifyEmail(email: string, otp: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const checkOtp = await this.otpService.findOtp(email);

        if (!checkOtp) {
          return resolve({
            status: "ERR",
            message: "The OTP code for this email does not exist",
          });
        }
        const isValid = await this.otpService.isValidOtp(otp, checkOtp.otp);

        if (!isValid) {
          return resolve({
            status: "ERR",
            message: "Error verifying email",
          });
        } else {
          const sql = `insert into user (email, full_name, password, role) values (?, ?, ?, ?)`;
          const values = [checkOtp.email, checkOtp.fullName, checkOtp.password, "customer"];

          const [rows] = (await this.db.execute(sql, values)) as [ResultSetHeader];

          if (rows.affectedRows > 0) {
            const detailCustomer = {
              email: checkOtp.email,
              fullName: checkOtp.fullName,
              role: "customer",
            };

            const access_token = generalAccessToken({ id: email, role: "customer" });
            const refresh_token = generalRefreshToken({ id: email, role: "customer" });
            const expirationTime = Date.now() + 60 * 60 * 1000;

            return resolve({
              status: "OK",
              message: "Register success",
              data: detailCustomer,
              access_token,
              refresh_token,
              expirationTime,
            });
          }
        }
      } catch (error) {
        console.log("error", error);
        reject({
          status: "ERR",
          message: "Error verifying email",
        });
      }
    });
  }

  verifyEmailForgotPassword(email: string, otp: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const checkOtp = await this.otpService.findOtp(email);

        if (!checkOtp) {
          return resolve({
            status: "ERR",
            message: "The OTP code for this email does not exist",
          });
        }
        const isValid = await this.otpService.isValidOtp(otp, checkOtp.otp);

        if (!isValid) {
          return resolve({
            status: "ERR",
            message: "Error verifying email",
          });
        } else {
          return resolve({
            status: "OK",
            message: "Verify email success",
          });
        }
      } catch (error) {
        console.log("error", error);
        reject({
          status: "ERR",
          message: "Error verifying email",
        });
      }
    });
  }

  fetchMe(id: number): Promise<object> {
    return new Promise(async (resolve, reject) => {
      try {
        let existingUser = null;
        existingUser = await this.redisService.getCachedUserById(id);

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
            await this.redisService.setCachedUser(existingUser, 60 * 60 * 24 * 7);
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

  getDetailUserByEmail(email: String): Promise<object> {
    return new Promise(async (resolve, reject) => {
      try {
        const [rows] = await this.db.execute("call fetchCustomerByEmail(?)", [email]);
        if (rows[0].length === 0) {
          resolve({
            status: "ERR",
            message: "Customer not found",
          });
        }
        resolve(rows[0][0]);
      } catch (error) {
        console.log("Err Service.getDetail", error);
        reject(error);
      }
    });
  }

  getAll(
    limit: number,
    offset: number,
    arrangeType: ArrangeType,
    emailSearch: string
  ): Promise<{ status: string; total: number; totalPage: number; data: object }> {
    return new Promise(async (resolve, reject) => {
      try {
        const totalCustomerCount = await this.total();
        const [row] = await this.db.execute("call getCustomers(?, ?, ?, ?)", [
          limit,
          offset,
          arrangeType,
          emailSearch,
        ]);
        let dataCustomer: ModelCustomer[] = row[0].map((item: ModelCustomer) => {
          item.createAt = formatDate(item.createAt, "DD/MM/YYYY", true);
          item.updateAt = formatDate(item.updateAt, "DD/MM/YYYY", true);
          return item;
        });
        resolve({
          status: "OK",
          total: totalCustomerCount,
          totalPage: Math.ceil(totalCustomerCount / limit),
          data: totalCustomerCount > 0 ? dataCustomer : [],
        });
      } catch (error) {
        console.error("Err Service.getall", error);
        reject(error);
      }
    });
  }

  updatePassword(dataUpdate: UpdatePassword): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const { email, passwordOld, passwordNew } = dataUpdate;

        const [rows] = await this.db.execute("call getCustomer(?)", [email]);
        if (rows[0].length === 0) {
          resolve({
            status: "ERR",
            message: "Customer not found",
          });
        }

        const compareCurrentPassword = await bcrypt.compareSync(passwordOld, rows[0][0].password);

        if (!compareCurrentPassword) {
          resolve({
            status: "ERR",
            message: "Verify password current is false",
          });
        }

        const comparePassword = bcrypt.compareSync(passwordNew, rows[0][0].password);

        const password = rows[0][0].password;

        if (comparePassword) {
          resolve({
            status: "ERR",
            message: "Nothing changes",
          });
        } else {
          const hash = bcrypt.hashSync(passwordNew, 10);

          const sql = "call updatePassword( ?, ?, ?)";
          const values = [email, password, hash];

          const [rows] = (await this.db.execute(sql, values)) as [ResultSetHeader];
          if (rows.affectedRows === 0) {
            return resolve({ status: "ERR", message: "Customer not found" });
          }
          resolve({
            status: "OK",
            message: "Update password success",
          });
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  updateNewPassword(dataUpdate: UpdatePassword): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const { email, passwordNew } = dataUpdate;

        const [rows] = await this.db.execute("call getCustomer(?)", [email]);
        if (rows[0].length === 0) {
          resolve({
            status: "ERR",
            message: "Customer not found",
          });
        }
        const hash = bcrypt.hashSync(passwordNew, 10);

        const sql = "call updateForgotPassword( ?, ?)";
        const values = [email, hash];

        const [rowsUpdate] = (await this.db.execute(sql, values)) as [ResultSetHeader];
        if (rowsUpdate.affectedRows === 0) {
          return resolve({ status: "ERR", message: "Customer not found" });
        }
        resolve({
          status: "OK",
          message: "Update password success",
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  add(newCustomer: ModelCustomer, fileCloudinary: CloudinaryAsset): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        if (!testEmail(newCustomer.email)) {
          console.log('"Invalid email format", newCustomer.email);');
          deleteOldFile(fileCloudinary.public_id, "image");
          return reject({
            status: "ERR",
            message: "Invalid email",
          });
        }
        const hashPass = await bcrypt.hash(newCustomer.password, 10);
        const sql = "call addCustomer(?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const values = [
          newCustomer.email,
          newCustomer.fullName,
          newCustomer.sex,
          hashPass,
          fileCloudinary ? fileCloudinary.secure_url : null,
          fileCloudinary ? fileCloudinary.public_id : null,
          newCustomer.phone,
          newCustomer.dateBirth,
          newCustomer.address,
        ];
        const [rows] = (await this.db.execute(sql, values)) as [ResultSetHeader];
        if (rows.affectedRows === 0) {
          deleteOldFile(fileCloudinary.public_id, "image");
          return reject({
            status: "ERR",
            message: "Create customer failed",
          });
        }
        resolve({
          status: "OK",
          message: "Create customer success",
        });
      } catch (error) {
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
        let cachedUserId = await this.redisService.getCachedUserIdByEmail(userEmail);

        if (!cachedUserId) {
          // B. Cache Miss -> Truy vấn DB
          // Nếu tìm thấy ID qua Email lookup (Cache Tham chiếu)
          existingUser = await this.userService.findUserByEmail(userEmail, "customer");
          if (existingUser) {
            // C. Cache Load (Tải lại Cache)
            // Lấy data từ DB (existingUser) và SET lại vào Redis
            // Hàm setCachedUser này phải tạo cả key Email và key ID hệ thống
            await this.redisService.setCachedUser(existingUser, 60 * 60 * 24 * 7);
          }
        } else {
          existingUser = await this.redisService.getCachedUserById(cachedUserId);
        }

        // --- BẮT ĐẦU LUỒNG XỬ LÝ CHÍNH (Đã có existingUser hoặc null) ---

        if (existingUser) {
          // LUỒNG: ĐÃ TỒN TẠI (Cache hoặc DB)
          if (existingUser.provider === "google") {
            access_token = generalAccessToken({ id: existingUser.id, role: "customer" });
            refresh_token = generalRefreshToken({ id: existingUser.id, role: "customer" });
            expirationTime = Date.now() + 60 * 60 * 1000;

            await this.redisService.setTokensInRedis(
              { id: existingUser.id, role: "customer" },
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
          await this.redisService.setCachedUser(newUserRecord, 60 * 60 * 24 * 7);

          access_token = generalAccessToken({ id: newUserId, role: "customer" });
          refresh_token = generalRefreshToken({ id: newUserId, role: "customer" });
          expirationTime = Date.now() + 60 * 60 * 1000;

          await this.redisService.setTokensInRedis(
            { id: newUserId, role: "customer" },
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
