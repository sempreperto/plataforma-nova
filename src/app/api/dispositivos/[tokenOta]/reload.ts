// Ficheiro: src/pages/api/dispositivos/[tokenOta]/reload.ts

import { publishMqttMessage } from '@/lib/mqttClient';
import type { NextApiRequest, NextApiResponse } from 'next';
// Adicione a sua lógica de autenticação (getServerSession) aqui para proteger a rota

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido.' });
  }

  const { tokenOta } = req.query;
  if (!tokenOta || typeof tokenOta !== 'string') {
    return res.status(400).json({ message: 'Token do dispositivo é obrigatório.' });
  }

  const topic = `sempreperto/dispositivo/${tokenOta}/comandos`;
  const payload = JSON.stringify({
    command: 'RELOAD_CONFIG',
  });

  try {
    await publishMqttMessage(topic, payload);
    console.log(`[API Reload] Comando de reload enviado para o dispositivo com token: ${tokenOta}`);
    res.status(200).json({ message: 'Comando de reload enviado com sucesso!' });
  } catch (error: any) {
    console.error(`[API Reload] Falha ao enviar comando de reload para ${tokenOta}:`, error.message);
    res.status(500).json({ message: 'Falha ao enviar comando para o dispositivo.' });
  }
}
