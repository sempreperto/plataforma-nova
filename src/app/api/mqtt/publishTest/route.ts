// Ficheiro: src/app/api/mqtt/publishTest/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { publishMqttMessage } from '@/lib/mqttClient';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
  }

  try {
    const { topic, message } = await request.json();

    if (!topic || typeof topic !== 'string' || !message) {
      return NextResponse.json({ message: 'Tópico e mensagem são obrigatórios.' }, { status: 400 });
    }

    // A lógica de publicação permanece a mesma
    await publishMqttMessage(topic, JSON.stringify(message));

    return NextResponse.json({ success: true, message: `Mensagem de teste enviada!` }, { status: 200 });

  } catch (error: any) {
    console.error('[API de Teste] Erro ao publicar mensagem MQTT:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
