// Ficheiro: src/app/api/dispositivos/novo/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { createDevice } from '@/lib/device.service';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }

  const body = await request.json();
  const {
    name,
    modelo,
    projetoId,
    enableVision,
    enableAdvancedCommands,
    enableMqtt,
    mqttBrokerHost,
    mqttBrokerPort,
    mqttUsername,
    mqttPassword,
    mqttPublishTopic,
    mqttSubscribeTopic
  } = body;

  if (!name || !modelo || !projetoId) {
    return NextResponse.json({ message: 'Nome, modelo e ID do projeto são obrigatórios.' }, { status: 400 });
  }

  try {
    const projectOwner = await prisma.projeto.findFirst({
        where: { id: projetoId, userId: session.user.id }
    });

    if (!projectOwner) {
        return NextResponse.json({ message: "Acesso negado. Você não é o dono deste projeto." }, { status: 403 });
    }

    const deviceData = {
        name,
        modelo,
        enableVision: !!enableVision,
        enableAdvancedCommands: !!enableAdvancedCommands,
        enableMqtt: !!enableMqtt,
        mqttBrokerHost: enableMqtt ? mqttBrokerHost : null,
        mqttBrokerPort: enableMqtt ? mqttBrokerPort : null,
        mqttUsername: enableMqtt ? mqttUsername : null,
        mqttPassword: enableMqtt ? mqttPassword : null,
        mqttPublishTopic: enableMqtt ? mqttPublishTopic : null,
        mqttSubscribeTopic: enableMqtt ? mqttSubscribeTopic : null,
    };

    const newDevice = await createDevice(deviceData, projetoId, session.user.id);

    return NextResponse.json(newDevice, { status: 201 });

  } catch (error) {
    console.error("Erro na API /api/dispositivos/novo:", error);
    return NextResponse.json({ message: 'Erro ao criar o dispositivo.' }, { status: 500 });
  }
}
