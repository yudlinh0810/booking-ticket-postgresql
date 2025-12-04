import { Coupon, Setting } from "@prisma/client";
import { BaseCacheService } from "./baseCache.service";

export class ConfigCacheService extends BaseCacheService {
  private TTL = 60 * 60 * 24; // 1 ngày

  async cacheSettings(settings: Setting[]): Promise<void> {
    await this.setKey("system:settings", JSON.stringify(settings), this.TTL);
  }

  async getSettings(): Promise<Setting[] | null> {
    const data = await this.getKey("system:settings");
    return data ? JSON.parse(data) : null;
  }

  async invalidateSettings(): Promise<void> {
    await this.deleteKey("system:settings");
  }

  // --- COUPON (Kiểm tra mã giảm giá) ---
  // Lưu key theo Code (ví dụ: "TET2025") để lookup cho nhanh
  async cacheCoupon(code: string, coupon: Coupon): Promise<void> {
    await this.setKey(`coupon:code:${code}`, JSON.stringify(coupon), this.TTL);
  }

  async getCouponByCode(code: string): Promise<Coupon | null> {
    const data = await this.getKey(`coupon:code:${code}`);
    return data ? JSON.parse(data) : null;
  }

  async removeCoupon(code: string): Promise<void> {
    await this.deleteKey(`coupon:code:${code}`);
  }
}
