/*
  Warnings:

  - The primary key for the `otp` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `customer_id` on the `seat` table. All the data in the column will be lost.
  - You are about to drop the column `is_delete` on the `ticket` table. All the data in the column will be lost.
  - You are about to drop the column `seats` on the `ticket` table. All the data in the column will be lost.
  - You are about to drop the `discount` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `company_id` to the `car` table without a default value. This is not possible if the table is not empty.
  - Made the column `capacity` on table `car` required. This step will fail if there are existing NULL values in that column.
  - Made the column `price` on table `ticket` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `company_id` to the `trip` table without a default value. This is not possible if the table is not empty.
  - Made the column `car_id` on table `trip` required. This step will fail if there are existing NULL values in that column.
  - Made the column `driver_id` on table `trip` required. This step will fail if there are existing NULL values in that column.
  - Made the column `trip_name` on table `trip` required. This step will fail if there are existing NULL values in that column.
  - Made the column `departure_location_id` on table `trip` required. This step will fail if there are existing NULL values in that column.
  - Made the column `start_time` on table `trip` required. This step will fail if there are existing NULL values in that column.
  - Made the column `arrival_location_id` on table `trip` required. This step will fail if there are existing NULL values in that column.
  - Made the column `end_time` on table `trip` required. This step will fail if there are existing NULL values in that column.
  - Made the column `price` on table `trip` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "CouponType" AS ENUM ('percentage', 'fixed');

-- CreateEnum
CREATE TYPE "CouponStatus" AS ENUM ('active', 'expired', 'inactive');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('system_update', 'trip_reminder');

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'manager';

-- DropForeignKey
ALTER TABLE "trip" DROP CONSTRAINT "trip_arrival_location_id_fkey";

-- DropForeignKey
ALTER TABLE "trip" DROP CONSTRAINT "trip_car_id_fkey";

-- DropForeignKey
ALTER TABLE "trip" DROP CONSTRAINT "trip_departure_location_id_fkey";

-- DropForeignKey
ALTER TABLE "trip" DROP CONSTRAINT "trip_driver_id_fkey";

-- AlterTable
ALTER TABLE "car" ADD COLUMN     "company_id" INTEGER NOT NULL,
ALTER COLUMN "capacity" SET NOT NULL;

-- AlterTable
ALTER TABLE "otp" DROP CONSTRAINT "otp_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "email" SET DATA TYPE VARCHAR(255),
ADD CONSTRAINT "otp_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "seat" DROP COLUMN "customer_id";

-- AlterTable
ALTER TABLE "ticket" DROP COLUMN "is_delete",
DROP COLUMN "seats",
ADD COLUMN     "is_deleted" BOOLEAN DEFAULT false,
ALTER COLUMN "price" SET NOT NULL;

-- AlterTable
ALTER TABLE "trip" ADD COLUMN     "company_id" INTEGER NOT NULL,
ALTER COLUMN "car_id" SET NOT NULL,
ALTER COLUMN "driver_id" SET NOT NULL,
ALTER COLUMN "trip_name" SET NOT NULL,
ALTER COLUMN "departure_location_id" SET NOT NULL,
ALTER COLUMN "start_time" SET NOT NULL,
ALTER COLUMN "arrival_location_id" SET NOT NULL,
ALTER COLUMN "end_time" SET NOT NULL,
ALTER COLUMN "price" SET NOT NULL;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "company_id" INTEGER,
ALTER COLUMN "email" SET DATA TYPE VARCHAR(255);

-- DropTable
DROP TABLE "discount";

-- DropEnum
DROP TYPE "DiscountStatus";

-- DropEnum
DROP TYPE "DiscountType";

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

-- CreateIndex
CREATE UNIQUE INDEX "bus_company_name_key" ON "bus_company"("name");

-- CreateIndex
CREATE UNIQUE INDEX "bus_company_email_key" ON "bus_company"("email");

-- CreateIndex
CREATE UNIQUE INDEX "coupon_code_key" ON "coupon"("code");

-- CreateIndex
CREATE INDEX "otp_email_idx" ON "otp"("email");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "bus_company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
ALTER TABLE "coupon" ADD CONSTRAINT "coupon_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "bus_company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
