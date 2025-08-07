// IoTDevicesStatus.tsx
import React, { useEffect, useRef, useState } from 'react';
import mqtt from 'mqtt';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Tipo de leitura recebida
interface Reading {
  temperature: number;
  timestamp: string;
}

// Tipo de dispositivo mantido no estado
interface Device {
  token: string;
  status: 'online' | 'offline';
  lastUpdate: string;
  readings: Reading[];
}

const MQTT_BROKER_URL = 'wss://broker.hivemq.com:8884'; // Usando WebSocket seguro (WSS)

const IoTDevicesStatus: React.FC = () => {
  const [devices, setDevices] = useState<Record<string, Device>>({});
  const mqttClient = useRef<mqtt.MqttClient | null>(null);

  useEffect(() => {
    // Conecta ao broker MQTT
    mqttClient.current = mqtt.connect(MQTT_BROKER_URL);

    mqttClient.current.on('connect', () => {
      console.log('Conectado ao MQTT broker');
      mqttClient.current?.subscribe('dispositivos/+/status');
    });

    // Quando uma mensagem é recebida
    mqttClient.current.on('message', (topic, message) => {
      const [, token] = topic.split('/');
      try {
        const payload: Reading = JSON.parse(message.toString());
        const now = new Date().toISOString();

        setDevices((prev) => {
          const existing = prev[token];
          const updatedReadings = existing?.readings
            ? [...existing.readings.slice(-19), payload] // Limita para últimos 20 pontos
            : [payload];

          return {
            ...prev,
            [token]: {
              token,
              status: 'online',
              lastUpdate: now,
              readings: updatedReadings,
            },
          };
        });
      } catch (err) {
        console.error('Erro ao processar mensagem MQTT:', err);
      }
    });

    // Verifica timeouts para marcar dispositivos offline
    const interval = setInterval(() => {
      setDevices((prev) => {
        const now = Date.now();
        const updated: typeof prev = {};

        for (const token in prev) {
          const last = new Date(prev[token].lastUpdate).getTime();
          const diff = now - last;
          updated[token] = {
            ...prev[token],
            status: diff > 60000 ? 'offline' : 'online',
          };
        }

        return updated;
      });
    }, 10000); // Verifica a cada 10s

    // Cleanup na desmontagem
    return () => {
      clearInterval(interval);
      mqttClient.current?.end();
      mqttClient.current = null;
    };
  }, []);

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Object.values(devices).map((device) => (
        <div key={device.token} className="bg-white shadow-md rounded-2xl p-4 border border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold text-gray-800">Dispositivo: {device.token}</h2>
            <span
              className={`text-sm font-medium px-3 py-1 rounded-full ${
                device.status === 'online' ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-600'
              }`}
            >
              {device.status}
            </span>
          </div>

          <div className="text-sm text-gray-500 mb-2">
            Última atualização: {new Date(device.lastUpdate).toLocaleTimeString()}
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={device.readings}>
              <XAxis dataKey="timestamp" tickFormatter={(ts) => new Date(ts).toLocaleTimeString()} />
              <YAxis domain={['auto', 'auto']} />
              <Tooltip
                formatter={(value: number) => `${value.toFixed(2)}°C`}
                labelFormatter={(label: string) =>
                  `Hora: ${new Date(label).toLocaleTimeString()}`
                }
              />
              <Line type="monotone" dataKey="temperature" stroke="#3b82f6" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  );
};

export default IoTDevicesStatus;
