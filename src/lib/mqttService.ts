// Ficheiro: /src/lib/mqttService.ts (VERSÃO TEMPO REAL)
import mqtt from 'mqtt';
import { prisma } from './prisma';
import { Server as SocketIOServer } from 'socket.io';

let mqttClient: mqtt.MqttClient | null = null;
let io: SocketIOServer | null = null;

// Função chamada quando uma mensagem MQTT é recebida
const handleMqttMessage = async (topic: string, message: Buffer) => {
  console.log(`MQTT: Mensagem recebida no tópico [${topic}]`);

  // O tópico de status é no formato 'soneh/dispositivos/TOKEN_DO_DISPOSITIVO/status'
  const topicParts = topic.split('/');
  if (topicParts.length === 4 && topicParts[3] === 'status') {
    const deviceToken = topicParts[2];
    console.log(`MQTT: Heartbeat recebido do dispositivo com token: ${deviceToken}`);

    try {
      // 1. Atualizamos o 'lastActivity' do dispositivo na base de dados
      const updatedDevice = await prisma.dispositivo.update({
        where: { tokenOta: deviceToken },
        data: { lastActivity: new Date() },
        select: { id: true, tokenOta: true, lastActivity: true, projetoId: true }
      });

      // 2. Se o 'io' (nosso servidor de sockets) estiver disponível...
      if (io && updatedDevice.projetoId) {
        // ...emitimos uma mensagem para a "sala" daquele projeto específico.
        // Todos os navegadores que estiverem a ver a página daquele projeto receberão esta mensagem.
        io.to(updatedDevice.projetoId).emit('device-status-update', {
          tokenOta: updatedDevice.tokenOta,
          lastActivity: updatedDevice.lastActivity,
          status: 'Online'
        });
        console.log(`Socket.IO: Status 'Online' enviado para a sala ${updatedDevice.projetoId}`);
      }
    } catch (error) {
      console.error(`MQTT: Erro ao processar o heartbeat para o token ${deviceToken}:`, error);
    }
  }
};

// Função para iniciar o cliente MQTT
export const initMqttClient = (socketIoServer: SocketIOServer) => {
  if (mqttClient) {
    return mqttClient;
  }

  io = socketIoServer; // Guardamos a instância do servidor de sockets

  const host = process.env.MQTT_HOST || 'localhost';
  const port = process.env.MQTT_PORT || '1883';
  const username = process.env.MQTT_USER;
  const password = process.env.MQTT_PASS;

  const connectUrl = `mqtt://${host}:${port}`;

  mqttClient = mqtt.connect(connectUrl, {
    username,
    password,
    clientId: `soneh_backend_${Math.random().toString(16).slice(2, 8)}`,
  });

  mqttClient.on('connect', () => {
    console.log('✅ Conectado ao Broker MQTT com sucesso!');
    // Inscreve-se em todos os tópicos de status de dispositivos
    mqttClient?.subscribe('soneh/dispositivos/+/status', (err) => {
      if (!err) {
        console.log(' MQTT: Inscrito nos tópicos de status dos dispositivos.');
      }
    });
  });

  mqttClient.on('error', (err) => {
    console.error(' MQTT: Erro de conexão:', err);
    mqttClient?.end();
  });

  mqttClient.on('reconnect', () => {
    console.log(' MQTT: A reconectar...');
  });

  // O mais importante: define a função que será executada quando uma mensagem chegar
  mqttClient.on('message', handleMqttMessage);

  return mqttClient;
};
