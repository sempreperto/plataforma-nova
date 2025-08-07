// src/pages/api/dispositivos/[tokenOta]/config.ts
import { NextApiRequest, NextApiResponse } from 'next';
// ✅ CORREÇÃO: Usando o atalho @/
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: 'Método não permitido.' });
  }

  const { tokenOta } = req.query;
  if (!tokenOta || typeof tokenOta !== 'string') {
    return res.status(400).json({ message: 'Token OTA é obrigatório.' });
  }

  try {
    const dispositivo = await prisma.dispositivo.findUnique({
      where: { tokenOta: tokenOta },
      select: {
        id: true,
        name: true,
        tokenOta: true,
        modelo: true,
        enableVision: true,
        enableAdvancedCommands: true,
        status: true,
        lastActivity: true,
        otaUpdatePending: true,
        lastCommand: true,
        createdAt: true,
        updatedAt: true,
        projetoId: true,
        userId: true,
        pinMappings: {
            orderBy: { pinNumber: 'asc' }
        },
        enableMqtt: true,
        mqttBrokerHost: true,
        mqttBrokerPort: true,
        mqttUsername: true,
        mqttPassword: true,
        mqttPublishTopic: true,
        mqttSubscribeTopic: true,
      }
    });

    if (!dispositivo) {
      return res.status(404).json({ message: 'Dispositivo não encontrado.' });
    }

    const {
      enableMqtt,
      mqttBrokerHost,
      mqttBrokerPort,
      mqttUsername,
      mqttPassword,
      mqttPublishTopic,
      mqttSubscribeTopic,
      ...restOfDispositivo
    } = dispositivo;

    const responseDispositivo = {
      ...restOfDispositivo,
      mqttConfig: {
        enabled: enableMqtt,
        brokerHost: mqttBrokerHost,
        brokerPort: mqttBrokerPort,
        username: mqttUsername,
        password: mqttPassword,
        publishTopic: mqttPublishTopic?.replace('{tokenOta}', tokenOta) ?? null,
        subscribeTopic: mqttSubscribeTopic?.replace('{tokenOta}', tokenOta) ?? null,
      }
    };

    return res.status(200).json(responseDispositivo);

  } catch (error) {
    console.error(`Erro ao obter configs para ${tokenOta}:`, error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}
