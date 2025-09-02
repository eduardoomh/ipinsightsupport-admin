-- DropForeignKey
ALTER TABLE "retainers" DROP CONSTRAINT "retainers_created_by_id_fkey";

-- AlterTable
ALTER TABLE "retainers" ALTER COLUMN "created_by_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "retainers" ADD CONSTRAINT "retainers_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
