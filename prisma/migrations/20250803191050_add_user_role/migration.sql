-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "role" "public"."Role" NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE "public"."SensorReading" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dispositivoId" TEXT NOT NULL,

    CONSTRAINT "SensorReading_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SensorReading_dispositivoId_timestamp_idx" ON "public"."SensorReading"("dispositivoId", "timestamp");

-- AddForeignKey
ALTER TABLE "public"."SensorReading" ADD CONSTRAINT "SensorReading_dispositivoId_fkey" FOREIGN KEY ("dispositivoId") REFERENCES "public"."Dispositivo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
