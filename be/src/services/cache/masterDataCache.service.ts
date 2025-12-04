import { Location, BusCompany, Car } from "@prisma/client";
import { BaseCacheService } from "./baseCache.service";

export class MasterDataCacheService extends BaseCacheService {
  private TTL = 60 * 60 * 24 * 30; // 30 ngày

  // --- LOCATION ---
  async cacheAllLocations(locations: Location[]): Promise<void> {
    await this.setKey("master:locations:all", JSON.stringify(locations), this.TTL);
  }

  async getAllLocations(): Promise<Location[] | null> {
    const data = await this.getKey("master:locations:all");
    if (!data) return null;
    return JSON.parse(data) as Location[];
  }

  // --- BUS COMPANY ---
  async cacheCompany(company: BusCompany): Promise<void> {
    await this.setKey(`master:company:${company.id}`, JSON.stringify(company), this.TTL);
  }

  async getCompany(id: number): Promise<BusCompany | null> {
    const data = await this.getKey(`master:company:${id}`);
    if (!data) return null;
    return JSON.parse(data) as BusCompany;
  }

  // Admin thêm/sửa/xóa một địa điểm
  async removeLocationsCache(): Promise<void> {
    // Vì ta lưu tất cả location vào 1 key list, nên chỉ cần xóa key này
    await this.deleteKey("master:locations:all");
  }

  // Admin sửa thông tin nhà xe
  async removeCompany(companyId: number): Promise<void> {
    await this.deleteKey(`master:company:${companyId}`);
  }

  // Admin sửa thông tin Xe (biển số, loại xe)
  async removeCar(carId: number): Promise<void> {
    await this.deleteKey(`master:car:${carId}`);
  }
}
