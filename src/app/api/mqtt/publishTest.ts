// src/pages/api/mqtt/publishTest.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { publishMqttMessage } from '@/lib/mqttClient'; // Reutilizamos a nossa função de publicação

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Apenas aceita o método POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido.' });
  }

  // Segurança: Garante que o utilizador está logado
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: 'Não autorizado.' });
  }

  // Extrai o token do dispositivo do corpo da requisição
  const { tokenOta } = req.body;
  if (!tokenOta) {
    return res.status(400).json({ message: 'Token do dispositivo é obrigatório.'});
  }

  // Define o tópico e a mensagem de teste
  const topic = `sempreperto/dispositivo/${tokenOta}/comandos`;
  const message = JSON.stringify({
    pin: 2, // Vamos testar com o pino do LED
    action: "BLINK"
  });

  try {
    // Chama a nossa função de publicação
    publishMqttMessage(topic, message);
    console.log(`[API de Teste] Mensagem de teste enviada para o tópico: ${topic}`);
    return res.status(200).json({ success: true, message: `Mensagem de teste enviada!` });
  } catch (error: any) {
    console.error('[API de Teste] Erro ao publicar mensagem MQTT:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}
