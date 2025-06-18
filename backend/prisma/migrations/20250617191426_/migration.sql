/*
  Warnings:

  - Added the required column `rating` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "mediaUrl" TEXT,
ADD COLUMN     "rating" INTEGER NOT NULL,
ALTER COLUMN "content" DROP NOT NULL;
