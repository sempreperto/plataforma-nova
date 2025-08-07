// Ficheiro: src/app/api/pins/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import { DeviceType } from '@prisma/client';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
  }

  // No App Router, o corpo da requisição é obtido com await request.json()
  const { tokenOta, pinNumber, pinAlias, deviceType } = await request.json();

  if (!tokenOta || typeof pinNumber !== 'number' || !pinAlias || !deviceType) {
    return NextResponse.json({ message: 'Todos os campos são obrigatórios.' }, { status: 400 });
  }

  if (!Object.values(DeviceType).includes(deviceType)) {
    return NextResponse.json({ message: `Tipo de dispositivo inválido: ${deviceType}` }, { status: 400 });
  }

  try {
    const dispositivo = await prisma.dispositivo.findFirst({
      where: {
        tokenOta: tokenOta,
        userId: session.user.id,
      },
      select: { id: true }
    });

    if (!dispositivo) {
      return NextResponse.json({ message: 'Dispositivo não encontrado ou acesso negado.' }, { status: 404 });
    }

    const novoPinMapping = await prisma.pinMapping.create({
      data: {
        pinNumber,
        pinAlias,
        deviceType,
        dispositivoId: dispositivo.id,
        currentState: (deviceType === 'LED' || deviceType === 'RELAY') ? 'OFF' : 'N/A',
      },
    });

    return NextResponse.json(novoPinMapping, { status: 201 });

  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ message: `O pino ${pinNumber} já está configurado para este dispositivo.` }, { status: 409 });
    }
    console.error("Erro ao criar mapeamento de pino:", error);
    return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
  }
}
