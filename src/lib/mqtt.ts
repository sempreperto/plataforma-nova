// Ficheiro: src/lib/mqtt.ts

import mqtt, { MqttClient } from 'mqtt';

// Garante que só existe UMA instância do cliente, mesmo com o hot-reload
const globalWithMqtt = global as { mqttClient?: MqttClient };

const createMqttClient = (): MqttClient => {
  const brokerUrl = process.env.MQTT_BROKER_URL;
  const options: mqtt.IClientOptions = {
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
    clientId: `soneh_platform_backend_${Date.now()}`,
  };
  console.log(`--- A iniciar conexão MQTT para ${brokerUrl} ---`);
  const client = mqtt.connect(brokerUrl, options);

  // ✨ CORREÇÃO: Aspas de fecho adicionada no final da string ✨
  client.on('connect', () => console.log('✅ [MQTT LOG] Backend conectado com sucesso!'));

  client.on('error', (error) => console.error('❌ [MQTT LOG] Erro de conexão do backend:', error));
  return client;
};

const mqttClient = globalWithMqtt.mqttClient ?? createMqttClient();
if (process.env.NODE_ENV === 'development') {
  globalWithMqtt.mqttClient = mqttClient;
}

// ESTA É A FUNÇÃO QUE SERÁ USADA EM TODAS AS SUAS ROTAS DE API
export const publishMqttMessage = (topic: string, message: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (mqttClient && mqttClient.connected) {
      mqttClient.publish(topic, message, { qos: 1 }, (error) => {
        if (error) {
          console.error(`[MQTT LOG] Falha ao publicar em '${topic}':`, error);
          reject(error);
        } else {
          console.log(`[MQTT LOG] Mensagem REALMENTE publicada em '${topic}': ${message}`);
          resolve();
        }
      });
    } else {
       reject(new Error('Cliente MQTT não está conectado.'));
    }
  });
};

// Exporta o cliente para ser usado na rota de status, se necessário
export { mqttClient };
