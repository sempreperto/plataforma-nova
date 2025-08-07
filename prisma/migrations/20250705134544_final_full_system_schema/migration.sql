/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Dispositivo` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Dispositivo` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "DeviceType" AS ENUM ('RELAY', 'LED', 'DIGITAL_SENSOR', 'ANALOG_SENSOR', 'CAMERA', 'MICROPHONE', 'I2C_DEVICE', 'SPI_DEVICE');

-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- AlterTable
ALTER TABLE "Dispositivo" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ALTER COLUMN "modelo" SET DEFAULT 'XIAO ESP32S3';

-- CreateTable
CREATE TABLE "PinMapping" (
    "id" TEXT NOT NULL,
    "pinNumber" INTEGER NOT NULL,
    "pinAlias" TEXT NOT NULL,
    "deviceType" "DeviceType" NOT NULL,
    "currentState" TEXT NOT NULL DEFAULT 'OFF',
    "dispositivoId" TEXT NOT NULL,

    CONSTRAINT "PinMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImageCapture" (
    "id" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "capturedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dispositivoId" TEXT NOT NULL,

    CONSTRAINT "ImageCapture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AudioLog" (
    "id" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "transcribedText" TEXT,
    "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dispositivoId" TEXT NOT NULL,

    CONSTRAINT "AudioLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PinMapping_dispositivoId_pinNumber_key" ON "PinMapping"("dispositivoId", "pinNumber");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PinMapping" ADD CONSTRAINT "PinMapping_dispositivoId_fkey" FOREIGN KEY ("dispositivoId") REFERENCES "Dispositivo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageCapture" ADD CONSTRAINT "ImageCapture_dispositivoId_fkey" FOREIGN KEY ("dispositivoId") REFERENCES "Dispositivo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AudioLog" ADD CONSTRAINT "AudioLog_dispositivoId_fkey" FOREIGN KEY ("dispositivoId") REFERENCES "Dispositivo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
