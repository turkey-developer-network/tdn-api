-- AlterTable
ALTER TABLE "users" ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- DropIndex
DROP INDEX "users_id_key";
