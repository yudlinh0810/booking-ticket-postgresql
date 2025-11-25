/*
  Warnings:

  - You are about to drop the column `full_name` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "full_name",
ADD COLUMN     "first_name" VARCHAR(50),
ADD COLUMN     "last_name" VARCHAR(50);
