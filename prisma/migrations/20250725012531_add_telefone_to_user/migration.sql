/*
  Warnings:

  - You are about to drop the column `firmwareAtual` on the `Dispositivo` table. All the data in the column will be lost.
  - You are about to drop the column `firmwareEsperado` on the `Dispositivo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Dispositivo" DROP COLUMN "firmwareAtual",
DROP COLUMN "firmwareEsperado";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "telefone" TEXT;
