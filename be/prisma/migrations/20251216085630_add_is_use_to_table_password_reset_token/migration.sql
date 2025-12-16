-- AlterTable
ALTER TABLE "password_reset_token" ADD COLUMN     "is_user" BOOLEAN NOT NULL DEFAULT false;
