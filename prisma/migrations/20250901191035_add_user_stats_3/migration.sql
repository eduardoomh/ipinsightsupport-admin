/*
  Warnings:

  - A unique constraint covering the columns `[user_id,month,year]` on the table `UserStats` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "UserStats_user_id_key";

-- AlterTable
ALTER TABLE "UserStats" ADD COLUMN     "month" INTEGER,
ADD COLUMN     "year" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "UserStats_user_id_month_year_key" ON "UserStats"("user_id", "month", "year");
