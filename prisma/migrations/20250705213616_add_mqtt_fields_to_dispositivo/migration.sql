-- AlterTable
ALTER TABLE "Dispositivo" ADD COLUMN     "enableMqtt" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "mqttBrokerHost" TEXT,
ADD COLUMN     "mqttBrokerPort" INTEGER,
ADD COLUMN     "mqttPassword" TEXT,
ADD COLUMN     "mqttPublishTopic" TEXT DEFAULT 'sempreperto/dispositivo/{tokenOta}/status',
ADD COLUMN     "mqttSubscribeTopic" TEXT DEFAULT 'sempreperto/dispositivo/{tokenOta}/comandos',
ADD COLUMN     "mqttUsername" TEXT;
