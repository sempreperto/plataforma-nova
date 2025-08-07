// src/pages/api/dispositivos/[tokenOta]/trigger-ota.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido.' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user?.id) {
    return res.status(401).json({ message: 'Não autorizado.' });
  }

  const { tokenOta } = req.query;
  if (typeof tokenOta !== 'string') {
    return res.status(400).json({ message: 'Token OTA é obrigatório.' });
  }

  try {
    // Apenas marca o dispositivo como tendo uma atualização pendente
    const updateResult = await prisma.dispositivo.updateMany({
      where: {
        tokenOta: tokenOta,
        userId: session.user.id, // Garante que só o dono pode disparar a atualização
      },
      data: { otaUpdatePending: true },
    });

    if (updateResult.count === 0) {
      return res.status(404).json({ message: 'Dispositivo não encontrado ou acesso negado.' });
    }

    return res.status(200).json({ message: `Comando de atualização enviado para o dispositivo com token: ${tokenOta}` });
  } catch (error) {
    console.error("Erro ao disparar OTA:", error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}
