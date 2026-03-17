/*
  Warnings:

  - You are about to drop the column `localation` on the `profiles` table. All the data in the column will be lost.
  - Made the column `avatarUrl` on table `profiles` required. This step will fail if there are existing NULL values in that column.
  - Made the column `bannerUrl` on table `profiles` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "localation",
ADD COLUMN     "location" TEXT,
ALTER COLUMN "avatarUrl" SET NOT NULL,
ALTER COLUMN "avatarUrl" SET DEFAULT 'https://pub-2e6c13927ac24d548fd5b783e3cdaeb5.r2.dev/avatars/default_profile.png',
ALTER COLUMN "bannerUrl" SET NOT NULL,
ALTER COLUMN "bannerUrl" SET DEFAULT 'https://pub-2e6c13927ac24d548fd5b783e3cdaeb5.r2.dev/avatars/default_banner.jpe';
