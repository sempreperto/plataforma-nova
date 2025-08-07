// Ficheiro: src/app/api/pins/[pinMappingId]/control/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import { publishMqttMessage } from '@/lib/mqttClient';

export async function POST(
  request: Request,
  { params }: { params: { pinMappingId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
  }

  const { pinMappingId } = params;
  const { state } = await request.json(); // 'ON' ou 'OFF'

  if (!pinMappingId || (state !== 'ON' && state !== 'OFF')) {
    return NextResponse.json({ message: 'Dados inválidos.' }, { status: 400 });
  }

  try {
    const pinMapping = await prisma.pinMapping.findFirst({
      where: {
        id: pinMappingId,
        dispositivo: { userId: session.user.id }
      },
      include: {
        dispositivo: { select: { tokenOta: true } }
      }
    });

    if (!pinMapping?.dispositivo) {
      return NextResponse.json({ message: 'Pino não encontrado ou acesso negado.' }, { status: 404 });
    }

    const updatedPinMapping = await prisma.pinMapping.update({
      where: { id: pinMappingId },
      data: { currentState: state },
    });

    const topic = `sempreperto/dispositivo/${pinMapping.dispositivo.tokenOta}/comandos`;
    const message = JSON.stringify({
      pin: updatedPinMapping.pinNumber,
      action: updatedPinMapping.currentState
    });

    await publishMqttMessage(topic, message);

    return NextResponse.json(updatedPinMapping);

  } catch (error) {
    console.error(`Erro ao controlar pino ${pinMappingId}:`, error);
    return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
  }
}
