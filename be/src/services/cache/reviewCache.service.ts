// Import type Review nếu bạn muốn strict type, hoặc dùng any nếu object có join bảng User
import { Review } from "@prisma/client";
import { BaseCacheService } from "./baseCache.service";

export class ReviewCacheService extends BaseCacheService {
  private TTL = 60 * 30; // 30m

  /**
   * Tạo key cache cho trang 1 của nhà xe
   * Pattern: review:company:{id}:page1
   */
  private getPage1Key(companyId: number): string {
    return `review:company:${companyId}:page1`;
  }

  // --- 1. SET: Lưu list review vào Redis ---
  async cacheFirstPageReviews(companyId: number, data: Review): Promise<void> {
    const key = this.getPage1Key(companyId);
    // data: { reviews: [], total: ..., average: ... }
    await this.setKey(key, JSON.stringify(data), this.TTL);
  }

  // --- 2. GET: Lấy review từ Redis ---
  async getFirstPageReviews(companyId: number): Promise<any | null> {
    const key = this.getPage1Key(companyId);
    const data = await this.getKey(key);

    if (!data) return null;

    // Parse string về lại Object/Array
    return JSON.parse(data);
  }

  // --- 3. DELETE: Xóa cache khi có review mới ---
  async invalidateReviews(companyId: number): Promise<void> {
    const key = this.getPage1Key(companyId);
    await this.deleteKey(key);
  }
}
