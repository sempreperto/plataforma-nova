// src/pages/api/dispositivos/[tokenOta]/connect.ts
import { NextApiRequest, NextApiResponse } from 'next';
// ✅ CORREÇÃO: Usando o atalho @/
import { prisma } from '@/lib/prisma';
import { verifyDeviceToken } from '@/lib/deviceAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Método não permitido.' });
  }

  const { tokenOta } = req.query;
  if (typeof tokenOta !== 'string') {
    return res.status(400).json({ message: 'Token OTA inválido.' });
  }

  const isAuthorized = await verifyDeviceToken(req, tokenOta);
  if (!isAuthorized) {
      return res.status(403).json({ message: 'Acesso negado.' });
  }

  try {
    const updatedDispositivo = await prisma.dispositivo.update({
      where: { tokenOta: tokenOta },
      data: {
        status: 'online',
        lastActivity: new Date(),
      },
      select: { id: true, name: true, status: true }
    });

    return res.status(200).json({
      message: 'Dispositivo conectado e status atualizado com sucesso!',
      dispositivo: updatedDispositivo,
    });

  } catch (error) {
    console.error(`Erro ao conectar dispositivo com token ${tokenOta}:`, error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}
