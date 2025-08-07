// ======================================================================
// CLIENTE MQTT SONEH v2.0 (PROFISSIONAL)
// OBJETIVO: Gerir a conexão com o broker MQTT de forma robusta,
// segura e eficiente, evitando múltiplas conexões em desenvolvimento.
// ======================================================================

// Ficheiro: src/lib/mqttClient.ts (Corrigido e Profissionalizado)
import mqtt, { MqttClient, IClientOptions } from 'mqtt';

const brokerUrl = process.env.MQTT_BROKER_URL;
if (!brokerUrl) {
  throw new Error("ERRO CRÍTICO: A variável de ambiente MQTT_BROKER_URL não está definida.");
}

const globalWithMqtt = global as typeof globalThis & {
  mqttClient?: MqttClient;
};

const createMqttClient = (): MqttClient => {
  const options: IClientOptions = {
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
    clientId: `plataforma_soneh_backend_${Date.now()}`,
    reconnectPeriod: 5000,
    connectTimeout: 10000,
  };
  console.log(`[MQTT] A conectar ao broker em: ${brokerUrl}`);
  const client = mqtt.connect(brokerUrl, options);

  client.on('connect', () => console.log('✅ [MQTT] Backend conectado com sucesso ao broker!'));
  client.on('error', (error) => console.error('❌ [MQTT] Erro na conexão:', error.message));
  client.on('reconnect', () => console.log('🔄 [MQTT] A tentar reconectar ao broker...'));
  client.on('close', () => console.warn('🔌 [MQTT] Conexão com o broker fechada.'));
  return client;
};

const mqttClient = globalWithMqtt.mqttClient ?? createMqttClient();

if (process.env.NODE_ENV === 'development') {
  globalWithMqtt.mqttClient = mqttClient;
}

export const publishMqttMessage = (topic: string, message: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!mqttClient.connected) {
      return reject(new Error("O backend não está conectado ao broker MQTT."));
    }
    mqttClient.publish(topic, message, { qos: 1 }, (error) => {
      if (error) {
        return reject(error);
      }
      resolve();
    });
  });
};

// ✨ CORREÇÃO PRINCIPAL: Exporta a instância do cliente para ser usada por outras APIs ✨
export { mqttClient };
