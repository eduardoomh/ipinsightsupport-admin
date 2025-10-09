-- CreateEnum
CREATE TYPE "billingType" AS ENUM ('HOURLY', 'MONTHLY_PLAN');

-- AlterTable
ALTER TABLE "clients" ADD COLUMN     "billing_type" "billingType" DEFAULT 'HOURLY';
