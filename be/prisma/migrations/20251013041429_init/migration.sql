-- AlterTable
ALTER TABLE "car" ADD COLUMN     "is_deleted" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "discount" ADD COLUMN     "is_deleted" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "feed_back" ADD COLUMN     "is_deleted" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "img_car" ADD COLUMN     "is_deleted" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "location" ADD COLUMN     "is_deleted" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "review" ADD COLUMN     "is_deleted" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "trip" ADD COLUMN     "is_deleted" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "is_deleted" BOOLEAN DEFAULT false;
