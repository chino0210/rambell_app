/*
  Warnings:

  - Added the required column `code_name` to the `etiquetas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "etiquetas" ADD COLUMN     "code_name" TEXT NOT NULL;
