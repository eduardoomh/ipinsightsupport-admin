-- CreateTable
CREATE TABLE "UserStats" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "total_work_entries" INTEGER DEFAULT 0,
    "companies_as_account_manager" INTEGER DEFAULT 0,
    "companies_as_team_member" INTEGER DEFAULT 0,
    "hours_engineering" DOUBLE PRECISION DEFAULT 0.0,
    "hours_architecture" DOUBLE PRECISION DEFAULT 0.0,
    "hours_senior_architecture" DOUBLE PRECISION DEFAULT 0.0,

    CONSTRAINT "UserStats_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserStats" ADD CONSTRAINT "UserStats_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
