// src/pages/api/dispositivos/[tokenOta]/pins.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import { DeviceType } from '@prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Método não permitido. Use POST.' });
  }

  // 1. Obter a sessão do usuário
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user?.id) {
    return res.status(401).json({ message: 'Não autorizado.' });
  }

  // 2. Obter os dados da requisição
  const { tokenOta } = req.query;
  const { pinNumber, pinAlias, deviceType } = req.body;

  if (!tokenOta || typeof tokenOta !== 'string') {
    return res.status(400).json({ message: 'Token OTA do dispositivo é obrigatório.' });
  }

  if (typeof pinNumber !== 'number' || !pinAlias || !deviceType) {
    return res.status(400).json({ message: 'Os campos pinNumber, pinAlias e deviceType são obrigatórios.' });
  }

  if (!Object.values(DeviceType).includes(deviceType)) {
    return res.status(400).json({ message: `Tipo de dispositivo inválido: ${deviceType}` });
  }

  try {
    // 3. ✨ VERIFICAÇÃO DE SEGURANÇA ✨
    // Busca o dispositivo que corresponde ao token E que pertence ao usuário logado.
    const dispositivo = await prisma.dispositivo.findFirst({
      where: {
        tokenOta: tokenOta,
        userId: session.user.id, // Garante que só o dono pode modificar
      },
      select: { id: true } // Só precisamos do ID para a próxima etapa
    });

    // 4. Se o dispositivo não for encontrado para este usuário, nega o acesso.
    if (!dispositivo) {
      return res.status(404).json({ message: 'Dispositivo não encontrado ou você não tem permissão para acessá-lo.' });
    }

    // 5. Se a verificação passou, cria o novo pino.
    const novoPinMapping = await prisma.pinMapping.create({
      data: {
        pinNumber,
        pinAlias,
        deviceType,
        dispositivoId: dispositivo.id, // Usa o ID do dispositivo verificado
        currentState: (deviceType === 'LED' || deviceType === 'RELAY') ? 'OFF' : 'N/A',
      },
    });

    return res.status(201).json(novoPinMapping);

  } catch (error: any) {
    // Trata o caso de o pino já existir (conflito)
    if (error.code === 'P2002') {
      return res.status(409).json({ message: `O pino ${pinNumber} já está configurado para este dispositivo.` });
    }

    console.error("Erro ao criar mapeamento de pino:", error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}
