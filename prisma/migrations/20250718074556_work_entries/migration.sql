-- CreateEnum
CREATE TYPE "RateType" AS ENUM ('engineering', 'architecture', 'senior_architecture');

-- CreateTable
CREATE TABLE "work_entries" (
    "id" TEXT NOT NULL,
    "billed_on" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hours_billed" DOUBLE PRECISION NOT NULL,
    "hours_spent" DOUBLE PRECISION NOT NULL,
    "hourly_rate" DOUBLE PRECISION NOT NULL,
    "summary" TEXT NOT NULL,
    "rate_type" "RateType" NOT NULL,
    "client_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "work_entries_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "work_entries" ADD CONSTRAINT "work_entries_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_entries" ADD CONSTRAINT "work_entries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
