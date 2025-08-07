// src/components/MqttConfigurator.tsx
import React from 'react';

// Define a interface para as propriedades que o componente receberá
interface MqttConfiguratorProps {
  // Os dados atuais do formulário
  formData: {
    mqttBrokerHost: string;
    mqttBrokerPort: number | string; // Usamos string para o input, mas o estado pode ser number
    mqttUsername: string;
    mqttPassword: string;
    mqttPublishTopic: string;
    mqttSubscribeTopic: string;
  };
  // A função para atualizar o estado no componente pai
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function MqttConfigurator({ formData, handleChange }: MqttConfiguratorProps) {
  return (
    // Envolvemos os campos numa div com um estilo subtil para os agrupar
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 my-6">
      <h3 className="text-xl font-bold text-purple-400 mb-4">Configurações MQTT</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Campo para o Host do Broker */}
        <div>
          <label htmlFor="mqttBrokerHost" className="text-sm text-gray-400 mb-1 block">
            Endereço do Broker MQTT
          </label>
          <input
            id="mqttBrokerHost"
            name="mqttBrokerHost"
            type="text"
            value={formData.mqttBrokerHost}
            onChange={handleChange}
            placeholder="ex: broker.hivemq.com ou 192.168.1.10"
            className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Campo para a Porta do Broker */}
        <div>
          <label htmlFor="mqttBrokerPort" className="text-sm text-gray-400 mb-1 block">
            Porta
          </label>
          <input
            id="mqttBrokerPort"
            name="mqttBrokerPort"
            type="number"
            value={formData.mqttBrokerPort}
            onChange={handleChange}
            placeholder="ex: 1883"
            className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Campo para o Nome de Utilizador */}
        <div>
          <label htmlFor="mqttUsername" className="text-sm text-gray-400 mb-1 block">
            Utilizador (opcional)
          </label>
          <input
            id="mqttUsername"
            name="mqttUsername"
            type="text"
            value={formData.mqttUsername}
            onChange={handleChange}
            placeholder="Utilizador do seu broker"
            className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Campo para a Senha */}
        <div>
          <label htmlFor="mqttPassword" className="text-sm text-gray-400 mb-1 block">
            Senha (opcional)
          </label>
          <input
            id="mqttPassword"
            name="mqttPassword"
            type="password"
            value={formData.mqttPassword}
            onChange={handleChange}
            placeholder="Senha do seu broker"
            className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Tópicos de Publicação e Subscrição (opcionalmente customizáveis) */}
        {/* Por enquanto, vamos manter os padrões que definimos no schema */}

      </div>
    </div>
  );
}
