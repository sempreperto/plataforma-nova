// Ficheiro: src/app/api/mqtt/publish/route.ts
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

    if (!topic || typeof topic !== 'string' || !message || typeof message !== 'string') {
      return NextResponse.json({ message: 'Tópico e mensagem são obrigatórios.' }, { status: 400 });
    }

    // Apenas chama a nossa função de publicação existente
    await publishMqttMessage(topic, message);

    return NextResponse.json({ success: true, message: `Mensagem publicada no tópico: ${topic}` }, { status: 200 });

  } catch (error: any) {
    console.error('[API Publish] Erro ao publicar mensagem MQTT:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
