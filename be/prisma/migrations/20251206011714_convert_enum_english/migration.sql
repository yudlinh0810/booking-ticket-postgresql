/*
  Warnings:

  - The values [xe thường,xe giường nằm] on the enum `CarType` will be removed. If these variants are still used in the database, this will fail.
  - The values [co-driver] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - The values [sẵn sàng,sắp khỏi hành,đang chạy,bảo trì,hoàn thành] on the enum `TripStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CarType_new" AS ENUM ('normal', 'sleeper', 'all');
ALTER TABLE "public"."car" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "car" ALTER COLUMN "type" TYPE "CarType_new" USING ("type"::text::"CarType_new");
ALTER TABLE "coupon" ALTER COLUMN "car_type" TYPE "CarType_new" USING ("car_type"::text::"CarType_new");
ALTER TYPE "CarType" RENAME TO "CarType_old";
ALTER TYPE "CarType_new" RENAME TO "CarType";
DROP TYPE "public"."CarType_old";
ALTER TABLE "car" ALTER COLUMN "type" SET DEFAULT 'normal';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('customer', 'admin', 'super_admin', 'driver', 'manager', 'co_driver');
ALTER TABLE "public"."user" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "user" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TABLE "otp" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'customer';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "TripStatus_new" AS ENUM ('ready', 'about_to_depart', 'running', 'maintenance', 'completed');
ALTER TABLE "public"."trip" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "trip" ALTER COLUMN "status" TYPE "TripStatus_new" USING ("status"::text::"TripStatus_new");
ALTER TYPE "TripStatus" RENAME TO "TripStatus_old";
ALTER TYPE "TripStatus_new" RENAME TO "TripStatus";
DROP TYPE "public"."TripStatus_old";
ALTER TABLE "trip" ALTER COLUMN "status" SET DEFAULT 'ready';
COMMIT;

-- AlterTable
ALTER TABLE "car" ALTER COLUMN "type" SET DEFAULT 'normal';

-- AlterTable
ALTER TABLE "trip" ALTER COLUMN "status" SET DEFAULT 'ready';
