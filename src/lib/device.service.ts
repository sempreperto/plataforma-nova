// Ficheiro: src/lib/device.service.ts (Corrigido e Completo)

import { prisma } from "./prisma";
import { randomBytes } from 'crypto';
import { Dispositivo } from "@prisma/client"; // Importa o tipo para mais segurança

// --- Interfaces ---
interface DeviceCreationData {
  name: string;
  modelo: string;
  enableVision: boolean;
  enableAdvancedCommands: boolean;
  enableMqtt: boolean;
  mqttBrokerHost: string | null;
  mqttBrokerPort: number | null;
  mqttUsername: string | null;
  mqttPassword: string | null;
  mqttPublishTopic: string | null;
  mqttSubscribeTopic: string | null;
}

// --- Funções do Serviço ---

export async function findDeviceById(dispositivoId: string, userId: string) {
  try {
    const dispositivo = await prisma.dispositivo.findFirst({
      where: {
        id: dispositivoId,
        userId: userId,
      },
      include: {
        pinMappings: {
          orderBy: { pinNumber: 'asc' },
        },
        imageCaptures: {
          orderBy: { capturedAt: 'desc' },
          take: 10,
        }
      },
    });
    return dispositivo;
  } catch (error) {
    console.error(`[DeviceService] Erro ao buscar dispositivo por ID ${dispositivoId}:`, error);
    throw new Error("Não foi possível buscar os detalhes do dispositivo.");
  }
}

const generateUniqueToken = async (): Promise<string> => {
  let token: string;
  let isUnique = false;
  while (!isUnique) {
    token = randomBytes(8).toString('hex');
    const existingDevice = await prisma.dispositivo.findUnique({ where: { tokenOta: token } });
    if (!existingDevice) {
      isUnique = true;
    }
  }
  return token;
};

export async function createDevice(
  deviceData: DeviceCreationData,
  projetoId: string,
  userId: string
) {
  try {
    const token = await generateUniqueToken();
    const newDevice = await prisma.dispositivo.create({
      data: {
        ...deviceData,
        tokenOta: token,
        status: 'offline',
        projeto: { connect: { id: projetoId } },
        user: { connect: { id: userId } },
      },
    });
    return newDevice;
  } catch (error) {
    console.error("[DeviceService] Erro ao criar dispositivo:", error);
    throw new Error("Não foi possível criar o dispositivo no banco de dados.");
  }
}

export const updateDevice = async (id: string, userId: string, data: Partial<Dispositivo>) => {
    const device = await prisma.dispositivo.findFirst({
        where: { id, userId }
    });

    if (!device) {
        throw new Error("Dispositivo não encontrado ou acesso negado.");
    }

    return await prisma.dispositivo.update({
        where: { id },
        data: data,
    });
};

export const deleteDevice = async (id: string, userId: string) => {
    const device = await prisma.dispositivo.findFirst({
        where: { id, userId }
    });

    if (!device) {
        throw new Error("Dispositivo não encontrado ou acesso negado.");
    }

    return await prisma.dispositivo.delete({
        where: { id },
    });
};
