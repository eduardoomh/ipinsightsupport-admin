/*
  Warnings:

  - You are about to drop the column `rate_type` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "rate_type",
ADD COLUMN     "type" "RateType" NOT NULL DEFAULT 'engineering';
