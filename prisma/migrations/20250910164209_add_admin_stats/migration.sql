-- CreateTable
CREATE TABLE "AdminStats" (
    "id" TEXT NOT NULL,
    "month" INTEGER,
    "year" INTEGER,
    "total_work_entries" INTEGER DEFAULT 0,
    "total_retainers" INTEGER DEFAULT 0,
    "total_clients" INTEGER DEFAULT 0,
    "retainers_amount" DOUBLE PRECISION DEFAULT 0.0,
    "hours_total" DOUBLE PRECISION DEFAULT 0.0,
    "hours_engineering" DOUBLE PRECISION DEFAULT 0.0,
    "hours_architecture" DOUBLE PRECISION DEFAULT 0.0,
    "hours_senior_architecture" DOUBLE PRECISION DEFAULT 0.0,

    CONSTRAINT "AdminStats_pkey" PRIMARY KEY ("id")
);
