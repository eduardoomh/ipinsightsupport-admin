-- CreateEnum
CREATE TYPE "LogLevel" AS ENUM ('INFO', 'WARNING', 'ERROR');

-- CreateEnum
CREATE TYPE "LogSource" AS ENUM ('WEBHOOK', 'SYSTEM', 'USER_ACTION', 'CRON_JOB', 'AUTH', 'CLIENT_UPDATE', 'RETAINER', 'WORK_ENTRY', 'SCHEDULE', 'API');

-- CreateTable
CREATE TABLE "logs" (
    "id" TEXT NOT NULL,
    "source" "LogSource" NOT NULL DEFAULT 'WEBHOOK',
    "level" "LogLevel" NOT NULL DEFAULT 'INFO',
    "message" TEXT NOT NULL,
    "details" JSONB,
    "user_id" TEXT,
    "client_id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "logs" ADD CONSTRAINT "logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logs" ADD CONSTRAINT "logs_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;
