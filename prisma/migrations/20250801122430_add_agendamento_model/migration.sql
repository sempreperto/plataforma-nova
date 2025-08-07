-- CreateEnum
CREATE TYPE "public"."ActionType" AS ENUM ('ON', 'OFF');

-- CreateTable
CREATE TABLE "public"."Agendamento" (
    "id" TEXT NOT NULL,
    "cronExpression" TEXT NOT NULL,
    "action" "public"."ActionType" NOT NULL,
    "duration" INTEGER,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "dispositivoId" TEXT NOT NULL,
    "pinMappingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Agendamento_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Agendamento" ADD CONSTRAINT "Agendamento_dispositivoId_fkey" FOREIGN KEY ("dispositivoId") REFERENCES "public"."Dispositivo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Agendamento" ADD CONSTRAINT "Agendamento_pinMappingId_fkey" FOREIGN KEY ("pinMappingId") REFERENCES "public"."PinMapping"("id") ON DELETE CASCADE ON UPDATE CASCADE;
