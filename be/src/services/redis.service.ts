// import { User } from "@prisma/client";
// import { RedisClient } from "./../config/redis";
// import * as dotenv from "dotenv";
// import { PrismaClient } from "@prisma/client";

// dotenv.config();

// // Định nghĩa TTL mặc định cho cache người dùng: 1 tuần
// const DEFAULT_TTL = 60 * 60 * 24 * 7;

// interface UserTokenPayload {
//   id: number;
//   role: string;
// }

// export class RedisService {
//   private redisClient: RedisClient;
//   private prisma = new PrismaClient();

//   constructor(client: RedisClient) {
//     this.redisClient = client;
//   }

//   // --- Utility Methods ---

//   private getEmailKey(email: string): string {
//     return `user:email:${email}`;
//   }

//   private getIdKey(id: number): string {
//     return `user::infor:${id}`;
//   }

//   private getSessionKey(userId: number): string {
//     return `session_${userId}`;
//   }

//   private getRefreshKey(userId: number): string {
//     return `refresh_${userId}`;
//   }

//   // --- User Cache Methods ---

//   /**
//    * Cập nhật toàn bộ danh sách người dùng vào Redis cache.
//    */

//   public async setCacheUser(): Promise<User[]> {
//     try {
//       const users = await this.prisma.user.findMany();
//       for (const user of users) {
//         const key = this.getIdKey(user.id);
//         await this.redisClient.set(key, JSON.stringify(user), {
//           EX: DEFAULT_TTL,
//         });
//       }
//     } catch (error) {
//       console.error("Lỗi khi cập nhật cache user từ Redis:", error);
//       return [];
//     }
//   }

//   /**
//    * Lấy ID hệ thống từ Redis bằng Email (Cache Tham chiếu - Lookup Cache).
//    * @returns ID hệ thống (number) nếu tìm thấy, ngược lại là null.
//    */

//   public async getCachedUserIdByEmail(email: string): Promise<number | null> {
//     const key = this.getEmailKey(email);
//     try {
//       const data = await this.redisClient.get(key); // Data sẽ là chuỗi ID

//       if (data && !Buffer.isBuffer(data)) {
//         // Trả về ID dưới dạng số. Nếu Redis trả về null/Buffer, nó sẽ bị bỏ qua
//         return parseInt(data as string, 10);
//       }
//       return null;
//     } catch (error) {
//       console.error("Lỗi khi lấy ID user từ cache email:", error);
//       return null;
//     }
//   }

//   /**
//    * Lấy thông tin cơ bản của người dùng từ Redis cache bằng ID hệ thống.
//    * @returns Đối tượng User nếu tìm thấy, ngược lại là null.
//    **/

//   public async getCachedUserById(id: number): Promise<User | null> {
//     const key = this.getIdKey(id); // Sử dụng key dùng ID
//     try {
//       const data = await this.redisClient.get(key);

//       if (data) {
//         let dataString: string;
//         // Xử lý Buffer/String
//         if (Buffer.isBuffer(data)) {
//           dataString = data.toString();
//         } else {
//           dataString = data as string;
//         }

//         return JSON.parse(dataString) as User;
//       }
//       return null;
//     } catch (error) {
//       console.error("Lỗi khi lấy cache user từ ID:", error);
//       return null;
//     }
//   }

//   /**
//    * Xóa thông tin người dùng khỏi Redis cache.
//    * @returns void
//    **/
//   public async deleteCachedUser(id: number, email: string): Promise<void> {
//     const idKey = this.getIdKey(id);
//     const emailKey = this.getEmailKey(email);
//     try {
//       await this.redisClient.del(idKey);
//       await this.redisClient.del(emailKey);
//     } catch (error) {
//       console.error("Lỗi khi xóa cache user khỏi Redis:", error);
//     }
//   }

//   /**
//    * Xóa tất cả thông tin người dùng khỏi Redis cache.
//    *  **/
//   public async deleteAllCachedUsers(): Promise<void> {
//     try {
//       // 1. Lấy tất cả các keys khớp với pattern user::infor:*
//       const keys = await this.redisClient.keys("user::infor:*").catch((err) => {
//         console.error("Lỗi khi lấy keys từ Redis:", err);
//         return [];
//       });

//       if (keys.length > 0) {
//         await this.redisClient.del(keys);
//       } else {
//         console.log("Không tìm thấy user nào cần xóa khỏi Redis.");
//       }
//     } catch (error) {
//       console.error("Lỗi khi xóa tất cả users khỏi Redis:", error);
//     }
//   }

//   /**
//    * Lấy thông tin tất caa người dùng từ Redis cache.
//    *  **/
//   public async getAllCachedUsers(): Promise<User[]> {
//     try {
//       const keys = await this.redisClient.keys("user::infor:*").catch((err) => {
//         console.error("Lỗi khi lấy keys từ Redis:", err);
//         return [];
//       });
//       let users: User[] = [];
//       if (!keys || keys.length === 0) {
//         users = await this.prisma.user.findMany();
//       } else {
//         for (const key of keys) {
//           const data = await this.redisClient.get(key);
//           if (data) {
//             let dataString: string;
//             // Xử lý Buffer/String
//             if (Buffer.isBuffer(data)) {
//               dataString = data.toString();
//             } else {
//               dataString = data as string;
//             }
//             const user = JSON.parse(dataString) as User;
//             users.push(user);
//           }
//         }
//       }
//       return users;
//     } catch (error) {
//       console.error("Lỗi khi lấy tất cả users từ Redis:", error);
//       return [];
//     }
//   }

//   /**
//    * Lưu thông tin cơ bản của người dùng vào Redis cache.
//    * @ttlInSeconds Thời gian sống của cache tính bằng giây. Mặc định là 1 tuần.
//    */
//   public async setCachedUser(userData: User, ttlInSeconds: number = DEFAULT_TTL): Promise<void> {
//     const emailKey = this.getEmailKey(userData.email);
//     const idKey = this.getIdKey(userData.id); // Dùng ID

//     try {
//       // 1. SET Cache Chính (Lưu full object bằng ID)
//       await this.redisClient.set(idKey, JSON.stringify(userData), {
//         EX: ttlInSeconds,
//       });

//       // 2. SET Cache Tham chiếu (Lưu ID bằng Email)
//       await this.redisClient.set(emailKey, userData.id.toString(), {
//         // Chỉ lưu ID (dạng string)
//         EX: ttlInSeconds,
//       });
//     } catch (error) {
//       console.error("Lỗi khi lưu cache user vào Redis:", error);
//     }
//   }

//   // --- Token Methods ---

//   /**
//    * Lưu Access Token và Refresh Token vào Redis.
//    * @returns void
//    */
//   public async setTokensInRedis(
//     user: UserTokenPayload,
//     access_token: string,
//     refresh_token: string,
//     accessTokenExpiresInSeconds: number,
//     refreshTokenExpiresInSeconds: number
//   ): Promise<void> {
//     const sessionKey = this.getSessionKey(user.id);
//     const refreshKey = this.getRefreshKey(user.id);

//     // Lưu Access Token
//     await this.redisClient.set(sessionKey, access_token, {
//       EX: accessTokenExpiresInSeconds,
//     });

//     // Lưu Refresh Token
//     await this.redisClient.set(refreshKey, refresh_token, {
//       EX: refreshTokenExpiresInSeconds,
//     });

//     return;
//   }
// }
