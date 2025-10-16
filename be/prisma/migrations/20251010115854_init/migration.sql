-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('male', 'female', 'other');

-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('local', 'google', 'facebook');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('available', 'busy', 'inactive');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('customer', 'admin', 'driver', 'co-driver');

-- CreateEnum
CREATE TYPE "CarType" AS ENUM ('xe thường', 'xe giường nằm', 'all');

-- CreateEnum
CREATE TYPE "CarStatus" AS ENUM ('busy', 'available', 'maintenance', 'inactive');

-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('percentage', 'fixed');

-- CreateEnum
CREATE TYPE "DiscountStatus" AS ENUM ('active');

-- CreateEnum
CREATE TYPE "TripStatus" AS ENUM ('sẵn sàng', 'sắp khỏi hành', 'đang chạy', 'bảo trì', 'hoàn thành');

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

-- CreateTable
CREATE TABLE "location" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "address" TEXT,
    "latitude" DECIMAL(10,8),
    "longitude" DECIMAL(11,8),

    CONSTRAINT "location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "provider_id" VARCHAR(255),
    "current_location_id" INTEGER,
    "email" VARCHAR(30),
    "full_name" VARCHAR(50),
    "password" VARCHAR(255),
    "sex" "Sex" DEFAULT 'female',
    "url_img" VARCHAR(255),
    "url_public_img" VARCHAR(255),
    "phone" VARCHAR(15),
    "date_birth" DATE,
    "address" VARCHAR(255),
    "license_number" VARCHAR(15),
    "experience_years" DATE,
    "provider" "Provider" DEFAULT 'local',
    "status" "UserStatus",
    "role" "Role" NOT NULL DEFAULT 'customer',
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
CREATE TABLE "car" (
    "id" SERIAL NOT NULL,
    "current_location_id" INTEGER,
    "license_plate" VARCHAR(10) NOT NULL,
    "capacity" INTEGER,
    "type" "CarType" DEFAULT 'xe thường',
    "status" "CarStatus" DEFAULT 'available',
    "create_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "car_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trip" (
    "id" SERIAL NOT NULL,
    "car_id" INTEGER,
    "driver_id" INTEGER,
    "trip_name" VARCHAR(50),
    "departure_location_id" INTEGER,
    "start_time" TIMESTAMP(3),
    "arrival_location_id" INTEGER,
    "end_time" TIMESTAMP(3),
    "status" "TripStatus" DEFAULT 'sẵn sàng',
    "price" DECIMAL(10,2) DEFAULT 0.00,
    "create_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seat" (
    "id" SERIAL NOT NULL,
    "trip_id" INTEGER,
    "customer_id" INTEGER,
    "seat_number" VARCHAR(5),
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
    "seats" VARCHAR(45),
    "price" DECIMAL(10,2),
    "payment_status" "PaymentStatus" DEFAULT 'pending',
    "payment_type" "PaymentType" DEFAULT 'banking',
    "is_delete" BOOLEAN DEFAULT false,
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
    "create_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "img_car_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discount" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50),
    "car_type" "CarType",
    "type" "DiscountType",
    "status" "DiscountStatus" DEFAULT 'active',
    "discount_amount" DECIMAL(10,2) DEFAULT 0.00,
    "description" TEXT,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "discount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feed_back" (
    "id" SERIAL NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "trip_id" INTEGER NOT NULL,
    "content" VARCHAR(500),
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feed_back_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review" (
    "id" SERIAL NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "trip_id" INTEGER NOT NULL,
    "rating" INTEGER,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trip_codriver" (
    "id" SERIAL NOT NULL,
    "trip_id" INTEGER,
    "co_driver_id" INTEGER,
    "create_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trip_codriver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "otp" (
    "email" VARCHAR(30) NOT NULL,
    "otp" VARCHAR(255),
    "password" VARCHAR(255),
    "full_name" VARCHAR(45),
    "create_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "role" "Role",

    CONSTRAINT "otp_pkey" PRIMARY KEY ("email")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "setting_user_id_key" ON "setting"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "car_license_plate_key" ON "car"("license_plate");

-- CreateIndex
CREATE UNIQUE INDEX "discount_code_key" ON "discount"("code");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_current_location_id_fkey" FOREIGN KEY ("current_location_id") REFERENCES "location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "setting" ADD CONSTRAINT "setting_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "car" ADD CONSTRAINT "car_current_location_id_fkey" FOREIGN KEY ("current_location_id") REFERENCES "location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip" ADD CONSTRAINT "trip_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "car"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip" ADD CONSTRAINT "trip_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip" ADD CONSTRAINT "trip_departure_location_id_fkey" FOREIGN KEY ("departure_location_id") REFERENCES "location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip" ADD CONSTRAINT "trip_arrival_location_id_fkey" FOREIGN KEY ("arrival_location_id") REFERENCES "location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

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
ALTER TABLE "feed_back" ADD CONSTRAINT "feed_back_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feed_back" ADD CONSTRAINT "feed_back_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_codriver" ADD CONSTRAINT "trip_codriver_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trip"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_codriver" ADD CONSTRAINT "trip_codriver_co_driver_id_fkey" FOREIGN KEY ("co_driver_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
