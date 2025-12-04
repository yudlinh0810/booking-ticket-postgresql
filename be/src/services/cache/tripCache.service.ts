import { Trip, Seat } from "@prisma/client";
import { BaseCacheService } from "./baseCache.service";

export class TripCacheService extends BaseCacheService {
  private TRIP_TTL = 60 * 60; // 1 tiếng
  private SEAT_TTL = 60 * 5; // 5 phút

  // --- TRIP DETAILS ---
  async cacheTripInfo(trip: Trip): Promise<void> {
    // Phải stringify vì setKey nhận string
    await this.setKey(`trip:info:${trip.id}`, JSON.stringify(trip), this.TRIP_TTL);
  }

  async getTripInfo(id: number): Promise<Trip | null> {
    const data = await this.getKey(`trip:info:${id}`);
    if (!data) return null;
    return JSON.parse(data) as Trip;
  }

  // --- TRIP SEATS ---
  async cacheTripSeats(tripId: number, seats: Seat[]): Promise<void> {
    await this.setKey(`trip:seats:${tripId}`, JSON.stringify(seats), this.SEAT_TTL);
  }

  async getTripSeats(tripId: number): Promise<Seat[] | null> {
    const data = await this.getKey(`trip:seats:${tripId}`);
    if (!data) return null;
    return JSON.parse(data) as Seat[];
  }

  // --- INVALIDATE ---
  async invalidateTrip(tripId: number) {
    await Promise.all([
      this.deleteKey(`trip:info:${tripId}`),
      this.deleteKey(`trip:seats:${tripId}`),
    ]);
  }

  // Admin sửa giờ chạy, sửa giá, hoặc hủy chuyến
  async removeTripInfo(tripId: number): Promise<void> {
    await this.deleteKey(`trip:info:${tripId}`);
  }

  // Có ai đó vừa đặt vé thành công (Seat status thay đổi)
  async removeTripSeats(tripId: number): Promise<void> {
    await this.deleteKey(`trip:seats:${tripId}`);
  }

  //  Tiện ích xóa tất cả về chuyến đó (Dùng khi xóa hẳn chuyến xe)
  async removeTripAll(tripId: number): Promise<void> {
    await Promise.all([
      this.deleteKey(`trip:info:${tripId}`),
      this.deleteKey(`trip:seats:${tripId}`),
    ]);
  }
}
