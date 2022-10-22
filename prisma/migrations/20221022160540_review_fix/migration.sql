/*
  Warnings:

  - You are about to drop the column `reviweeeId` on the `Review` table. All the data in the column will be lost.
  - Added the required column `revieweeId` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_reviweeeId_fkey";

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "reviweeeId",
ADD COLUMN     "revieweeId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_revieweeId_fkey" FOREIGN KEY ("revieweeId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
