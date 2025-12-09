export enum Sex {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
}
export enum Provider {
  LOCAL = "local",
  GOOGLE = "google",
  FACEBOOK = "facebook",
}
export enum UserStatus {
  ACTIVE = "active",
  BUSY = "busy",
  INACTIVE = "inactive",
  LOCK = "lock",
}
export enum Role {
  CUSTOMER = "customer",
  ADMIN = "admin",
  SUPER_ADMIN = "super_admin",
  DRIVER = "driver",
  MANAGER = "manager",
  CO_DRIVER = "co_driver",
}
export enum CarType {
  NORMAL = "normal",
  SLEEPER = "sleeper",
  ALL = "all",
}
export enum CarStatus {
  BUSY = "busy",
  AVAILABLE = "available",
  MAINTENANCE = "maintenance",
  INACTIVE = "inactive",
}
export enum CouponType {
  PERCENTAGE = "percentage",
  FIXED = "fixed",
}
export enum CouponStatus {
  ACTIVE = "active",
  EXPIRED = "expired",
  INACTIVE = "inactive",
}
export enum TripStatus {
  READY = "ready",
  ABOUT_TO_DEPART = "about_to_depart",
  RUNNING = "running",
  MAINTENANCE = "maintenance",
  COMPLETED = "completed",
}
export enum SeatFloor {
  TOP = "top",
  BOTTOM = "bottom",
}
export enum SeatStatus {
  AVAILABLE = "available",
  PENDING = "pending",
  BOOKED = "booked",
  UNAVAILABLE = "unavailable",
}
export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
  REFUNDED = "refunded",
}
export enum PaymentType {
  BANKING = "banking",
  CASH = "cash",
}
export enum TicketSeatStatus {
  RESERVED = "reserved",
  OCCUPIED = "occupied",
  CANCELLED = "cancelled",
}
export enum Theme {
  LIGHT = "light",
  DARK = "dark",
}
export enum NotificationType {
  SYSTEM_UPDATE = "system_update",
  TRIP_REMINDER = "trip_reminder",
}
