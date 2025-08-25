-- AlterTable
ALTER TABLE "client_status_history" ADD COLUMN     "title" TEXT,
ALTER COLUMN "status" DROP NOT NULL;
