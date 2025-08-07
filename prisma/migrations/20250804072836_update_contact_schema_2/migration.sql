-- DropForeignKey
ALTER TABLE "contacts" DROP CONSTRAINT "contacts_client_id_fkey";

-- AlterTable
ALTER TABLE "contacts" ALTER COLUMN "client_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;
