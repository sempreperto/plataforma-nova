// Ficheiro: src/app/api/dispositivos/[tokenOta]/camera/trigger/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import { publishMqttMessage } from '@/lib/mqttClient';

export async function POST(
  request: Request,
  { params }: { params: { tokenOta: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
  }

  const { tokenOta } = params;

  try {
    // Valida se o dispositivo pertence ao usuário
    const device = await prisma.dispositivo.findFirst({
      where: {
        tokenOta: tokenOta,
        userId: session.user.id,
      }
    });

    if (!device) {
      return NextResponse.json({ message: 'Dispositivo não encontrado ou acesso negado.' }, { status: 404 });
    }

    const topic = `sempreperto/dispositivo/${tokenOta}/comandos`;
    const payload = JSON.stringify({ command: 'TAKE_PHOTO' });

    await publishMqttMessage(topic, payload);

    return NextResponse.json({ message: 'Comando para tirar foto enviado com sucesso!' });

  } catch (error: any) {
    return NextResponse.json({ message: 'Falha ao enviar comando para o dispositivo.' }, { status: 500 });
  }
}
