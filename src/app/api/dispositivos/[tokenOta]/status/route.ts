import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyDeviceToken } from '@/lib/deviceAuth'; // Recomendo descomentar a segurança

export async function POST(
  request: Request,
  { params }: { params: { tokenOta: string } }
) {
  const { tokenOta } = params;

  // if (!await verifyDeviceToken(request, tokenOta)) {
  //     return NextResponse.json({ message: 'Acesso negado.' }, { status: 403 });
  // }

  try {
    // Passo 1: Atualiza a atividade e busca o estado atual
    const dispositivo = await prisma.dispositivo.update({
      where: { tokenOta: tokenOta },
      data: {
        lastActivity: new Date(),
        status: 'online',
      },
      select: {
        otaUpdatePending: true,
        lastCommand: true
      }
    });

    // ✨ CORREÇÃO LÓGICA APLICADA AQUI ✨
    const commandToSend = dispositivo.lastCommand; // 1. Guarda o comando original

    if (commandToSend) {
      await prisma.dispositivo.update({
        where: { tokenOta: tokenOta },
        data: { lastCommand: null }, // 2. Limpa o comando no banco de dados
      });
    }

    return NextResponse.json({
      otaUpdatePending: dispositivo.otaUpdatePending,
      lastCommand: commandToSend, // 3. Responde com o comando original que foi guardado
    });

  } catch (error) {
    return NextResponse.json({ message: `Dispositivo com token '${tokenOta}' não encontrado.` }, { status: 404 });
  }
}
