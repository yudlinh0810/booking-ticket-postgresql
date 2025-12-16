-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('male', 'female', 'other');

-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('local', 'google', 'facebook');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('active', 'busy', 'inactive', 'lock');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('customer', 'admin', 'super_admin', 'driver', 'manager', 'co_driver');

-- CreateEnum
CREATE TYPE "CarType" AS ENUM ('normal', 'sleeper', 'all');

-- CreateEnum
CREATE TYPE "CarStatus" AS ENUM ('busy', 'available', 'maintenance', 'inactive');

-- CreateEnum
CREATE TYPE "CouponType" AS ENUM ('percentage', 'fixed');

-- CreateEnum
CREATE TYPE "CouponStatus" AS ENUM ('active', 'expired', 'inactive');

-- CreateEnum
CREATE TYPE "TripStatus" AS ENUM ('ready', 'about_to_depart', 'running', 'maintenance', 'completed');

-- CreateEnum
CREATE TYPE "SeatFloor" AS ENUM ('top', 'bottom');

-- CreateEnum
CREATE TYPE "SeatStatus" AS ENUM ('available', 'pending', 'booked', 'unavailable');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'paid', 'failed', 'refunded');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('banking', 'cash');

-- CreateEnum
CREATE TYPE "TicketSeatStatus" AS ENUM ('reserved', 'occupied', 'cancelled');

-- CreateEnum
CREATE TYPE "Theme" AS ENUM ('light', 'dark');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('system_update', 'trip_reminder');

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "provider_id" VARCHAR(255),
    "company_id" INTEGER,
    "current_location_id" INTEGER,
    "email" VARCHAR(255),
    "username" VARCHAR(50),
    "first_name" VARCHAR(50),
    "last_name" VARCHAR(50),
    "password" VARCHAR(255),
    "sex" "Sex" DEFAULT 'female',
    "url_img" VARCHAR(255),
    "url_public_img" VARCHAR(255),
    "phone" VARCHAR(15),
    "date_birth" DATE,
    "address" VARCHAR(255),
    "license_number" VARCHAR(15),
    "start_work_date" DATE,
    "provider" "Provider" DEFAULT 'local',
    "status" "UserStatus",
    "role" "Role" NOT NULL DEFAULT 'customer',
    "is_deleted" BOOLEAN DEFAULT false,
    "create_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "setting" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "notification_enabled" BOOLEAN DEFAULT true,
    "theme" "Theme" DEFAULT 'light',
    "language" VARCHAR(10) DEFAULT 'vi',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "setting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification" (
    "id" SERIAL NOT NULL,
    "recipient_id" INTEGER NOT NULL,
    "type" "NotificationType" NOT NULL,
    "content" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "link_to" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_reset_token" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_reset_token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "location" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "address" TEXT,
    "latitude" DECIMAL(10,8),
    "longitude" DECIMAL(11,8),
    "is_deleted" BOOLEAN DEFAULT false,

    CONSTRAINT "location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bus_company" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255),
    "phone" VARCHAR(15),
    "address" VARCHAR(255),
    "is_deleted" BOOLEAN DEFAULT false,
    "create_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bus_company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "car" (
    "id" SERIAL NOT NULL,
    "current_location_id" INTEGER,
    "company_id" INTEGER NOT NULL,
    "license_plate" VARCHAR(10) NOT NULL,
    "capacity" INTEGER NOT NULL,
    "type" "CarType" DEFAULT 'normal',
    "status" "CarStatus" DEFAULT 'available',
    "is_deleted" BOOLEAN DEFAULT false,
    "create_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "car_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trip" (
    "id" SERIAL NOT NULL,
    "company_id" INTEGER NOT NULL,
    "car_id" INTEGER NOT NULL,
    "driver_id" INTEGER NOT NULL,
    "trip_name" VARCHAR(50) NOT NULL,
    "departure_location_id" INTEGER NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "arrival_location_id" INTEGER NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "status" "TripStatus" DEFAULT 'ready',
    "price" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "is_deleted" BOOLEAN DEFAULT false,
    "create_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seat" (
    "id" SERIAL NOT NULL,
    "trip_id" INTEGER NOT NULL,
    "seat_number" VARCHAR(5) NOT NULL,
    "floor" "SeatFloor",
    "status" "SeatStatus" DEFAULT 'available',
    "update_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "seat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticket" (
    "id" SERIAL NOT NULL,
    "trip_id" INTEGER NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "transaction_id" VARCHAR(100),
    "email" VARCHAR(50),
    "full_name" VARCHAR(50),
    "phone" VARCHAR(15),
    "price" DECIMAL(10,2) NOT NULL,
    "payment_status" "PaymentStatus" DEFAULT 'pending',
    "payment_type" "PaymentType" DEFAULT 'banking',
    "is_deleted" BOOLEAN DEFAULT false,
    "create_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticket_seat" (
    "id" SERIAL NOT NULL,
    "ticket_id" INTEGER NOT NULL,
    "seat_id" INTEGER NOT NULL,
    "status" "TicketSeatStatus",
    "create_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ticket_seat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "img_car" (
    "id" SERIAL NOT NULL,
    "car_id" INTEGER NOT NULL,
    "url_img" VARCHAR(255) NOT NULL,
    "url_public_img" VARCHAR(255) NOT NULL,
    "is_main" BOOLEAN DEFAULT false,
    "is_deleted" BOOLEAN DEFAULT false,
    "create_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "img_car_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coupon" (
    "id" SERIAL NOT NULL,
    "company_id" INTEGER,
    "code" VARCHAR(50),
    "car_type" "CarType" NOT NULL,
    "type" "CouponType" NOT NULL,
    "status" "CouponStatus" NOT NULL DEFAULT 'active',
    "coupon_amount" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "description" TEXT NOT NULL,
    "url_img" VARCHAR(255) NOT NULL,
    "url_public_img" VARCHAR(255) NOT NULL,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "is_deleted" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "coupon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feed_back" (
    "id" SERIAL NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "trip_id" INTEGER NOT NULL,
    "content" VARCHAR(500),
    "is_deleted" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feed_back_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review" (
    "id" SERIAL NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "trip_id" INTEGER NOT NULL,
    "rating" INTEGER,
    "is_deleted" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trip_codriver" (
    "id" SERIAL NOT NULL,
    "trip_id" INTEGER NOT NULL,
    "co_driver_id" INTEGER NOT NULL,
    "create_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trip_codriver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "otp" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "otp" VARCHAR(255),
    "password" VARCHAR(255),
    "full_name" VARCHAR(45),
    "create_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "role" "Role",

    CONSTRAINT "otp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE INDEX "user_role_idx" ON "user"("role");

-- CreateIndex
CREATE INDEX "user_company_id_idx" ON "user"("company_id");

-- CreateIndex
CREATE INDEX "user_status_idx" ON "user"("status");

-- CreateIndex
CREATE UNIQUE INDEX "setting_user_id_key" ON "setting"("user_id");

-- CreateIndex
CREATE INDEX "notification_recipient_id_idx" ON "notification"("recipient_id");

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_token_user_id_key" ON "password_reset_token"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_token_token_key" ON "password_reset_token"("token");

-- CreateIndex
CREATE UNIQUE INDEX "bus_company_name_key" ON "bus_company"("name");

-- CreateIndex
CREATE UNIQUE INDEX "bus_company_email_key" ON "bus_company"("email");

-- CreateIndex
CREATE UNIQUE INDEX "car_license_plate_key" ON "car"("license_plate");

-- CreateIndex
CREATE INDEX "trip_company_id_idx" ON "trip"("company_id");

-- CreateIndex
CREATE INDEX "trip_departure_location_id_arrival_location_id_start_time_idx" ON "trip"("departure_location_id", "arrival_location_id", "start_time");

-- CreateIndex
CREATE UNIQUE INDEX "seat_trip_id_seat_number_key" ON "seat"("trip_id", "seat_number");

-- CreateIndex
CREATE INDEX "ticket_customer_id_idx" ON "ticket"("customer_id");

-- CreateIndex
CREATE INDEX "ticket_trip_id_idx" ON "ticket"("trip_id");

-- CreateIndex
CREATE INDEX "ticket_transaction_id_idx" ON "ticket"("transaction_id");

-- CreateIndex
CREATE UNIQUE INDEX "ticket_seat_ticket_id_seat_id_key" ON "ticket_seat"("ticket_id", "seat_id");

-- CreateIndex
CREATE UNIQUE INDEX "coupon_code_key" ON "coupon"("code");

-- CreateIndex
CREATE UNIQUE INDEX "trip_codriver_trip_id_co_driver_id_key" ON "trip_codriver"("trip_id", "co_driver_id");

-- CreateIndex
CREATE INDEX "otp_email_idx" ON "otp"("email");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_current_location_id_fkey" FOREIGN KEY ("current_location_id") REFERENCES "location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "bus_company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "setting" ADD CONSTRAINT "setting_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_reset_token" ADD CONSTRAINT "password_reset_token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "car" ADD CONSTRAINT "car_current_location_id_fkey" FOREIGN KEY ("current_location_id") REFERENCES "location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "car" ADD CONSTRAINT "car_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "bus_company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip" ADD CONSTRAINT "trip_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "car"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip" ADD CONSTRAINT "trip_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip" ADD CONSTRAINT "trip_departure_location_id_fkey" FOREIGN KEY ("departure_location_id") REFERENCES "location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip" ADD CONSTRAINT "trip_arrival_location_id_fkey" FOREIGN KEY ("arrival_location_id") REFERENCES "location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip" ADD CONSTRAINT "trip_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "bus_company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seat" ADD CONSTRAINT "seat_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket" ADD CONSTRAINT "ticket_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket" ADD CONSTRAINT "ticket_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_seat" ADD CONSTRAINT "ticket_seat_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_seat" ADD CONSTRAINT "ticket_seat_seat_id_fkey" FOREIGN KEY ("seat_id") REFERENCES "seat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "img_car" ADD CONSTRAINT "img_car_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "car"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupon" ADD CONSTRAINT "coupon_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "bus_company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feed_back" ADD CONSTRAINT "feed_back_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feed_back" ADD CONSTRAINT "feed_back_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_codriver" ADD CONSTRAINT "trip_codriver_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_codriver" ADD CONSTRAINT "trip_codriver_co_driver_id_fkey" FOREIGN KEY ("co_driver_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
