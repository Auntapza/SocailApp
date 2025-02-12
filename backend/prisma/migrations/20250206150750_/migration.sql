/*
  Warnings:

  - You are about to drop the column `laname` on the `user` table. All the data in the column will be lost.
  - Added the required column `lname` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `laname`,
    ADD COLUMN `lname` VARCHAR(191) NOT NULL;
