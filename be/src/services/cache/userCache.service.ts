import { User, PrismaClient } from "@prisma/client";
import { BaseCacheService } from "./baseCache.service";

export class UserCacheService extends BaseCacheService {
  private TTL = 60 * 60 * 24 * 7; // 1 tuần

  // --- Methods ---
  async cacheUser(user: User): Promise<void> {
    const idKey = `user:info:${user.id}`;
    //  Key mapping (email -> id)
    const emailKey = user.email ? `user:email:${user.email}` : null;
    const phoneKey = user.phone ? `user:phone:${user.phone}` : null;

    const promises = [this.setKey(idKey, JSON.stringify(user), this.TTL)];

    // Lưu ID user vào key email/phone để map ngược lại
    if (emailKey) promises.push(this.setKey(emailKey, user.id.toString(), this.TTL));
    if (phoneKey) promises.push(this.setKey(phoneKey, user.id.toString(), this.TTL));

    await Promise.all(promises);
  }

  async getUserById(id: number | string): Promise<User | null> {
    const data = await this.getKey(`user:info:${id}`);
    if (!data) return null;
    return JSON.parse(data) as User;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    // 1: Lấy ID từ key email
    const userIdStr = await this.getKey(`user:email:${email}`);
    if (!userIdStr) return null;

    // 2: Lấy User info từ ID vừa tìm được
    return this.getUserById(parseInt(userIdStr));
  }

  async removeUser(user: User): Promise<void> {
    const keysToDelete: string[] = [];

    // 1. Xóa Key chính
    keysToDelete.push(`user:info:${user.id}`);

    // 2. Xóa các Key phụ (Mapping) nếu có
    if (user.email) keysToDelete.push(`user:email:${user.email}`);
    if (user.username) keysToDelete.push(`user:username:${user.username}`);
    if (user.phone) keysToDelete.push(`user:phone:${user.phone}`);

    // Thực hiện xóa đồng thời
    await Promise.all(keysToDelete.map((key) => this.deleteKey(key)));
  }
}
