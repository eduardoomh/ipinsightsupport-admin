-- AlterTable
ALTER TABLE "clients" ADD COLUMN     "estimated_architecture_hours" DOUBLE PRECISION DEFAULT 0.0,
ADD COLUMN     "estimated_engineering_hours" DOUBLE PRECISION DEFAULT 0.0,
ADD COLUMN     "estimated_senior_architecture_hours" DOUBLE PRECISION DEFAULT 0.0;
