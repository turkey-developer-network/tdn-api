/*
  Warnings:

  - You are about to drop the column `category` on the `tags` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Category" AS ENUM ('AI', 'GAME', 'MOBILE', 'BACKEND', 'FRONTEND');

-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "category" "Category"[];

-- AlterTable
ALTER TABLE "tags" DROP COLUMN "category";

-- CreateIndex
CREATE INDEX "posts_category_idx" ON "posts"("category");
