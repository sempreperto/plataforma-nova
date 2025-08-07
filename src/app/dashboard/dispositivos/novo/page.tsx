// src/app/dashboard/dispositivos/novo/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
// ✨ 1. Importamos o nosso novo componente
import MqttConfigurator from '@/components/MqttConfigurator';

interface FormData {
  name: string;
  modelo: string;
  projetoId: string;
  enableVision: boolean;
  enableAdvancedCommands: boolean;
  enableMqtt: boolean; // Este checkbox irá controlar a visibilidade do formulário
  mqttBrokerHost: string;
  mqttBrokerPort: number | string;
  mqttUsername: string;
  mqttPassword: string;
  mqttPublishTopic: string;
  mqttSubscribeTopic: string;
}

interface Projeto {
  id: string;
  name: string;
}

export default function NovoDispositivoPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    modelo: 'ESP32-WROOM-32', // Modelo padrão
    projetoId: '',
    enableVision: false,
    enableAdvancedCommands: false,
    enableMqtt: false, // Começa desabilitado
    mqttBrokerHost: '',
    mqttBrokerPort: '', // Inicia como string vazia
    mqttUsername: '',
    mqttPassword: '',
    mqttPublishTopic: '',
    mqttSubscribeTopic: '',
  });
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ... (o resto das suas funções useEffect e handleSubmit continua igual)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    // Lógica para o checkbox
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    // ... a sua lógica de submit que já funciona
  };


  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
          Cadastrar Novo Dispositivo
        </h1>

        <form onSubmit={handleSubmit} className="bg-gray-800/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-700">
          {/* ... (seus campos de Nome, Modelo e Projeto continuam aqui) ... */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
             {/* Campo Nome do Dispositivo */}
             {/* Campo Modelo da Placa */}
             {/* Campo Projeto */}
          </div>


          {/* ✨ 2. Checkbox para habilitar o formulário MQTT ✨ */}
          <div className="mb-4 p-4 border border-gray-700 rounded-lg">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                id="enableMqtt"
                name="enableMqtt"
                checked={formData.enableMqtt}
                onChange={handleChange}
                className="h-5 w-5 rounded bg-gray-700 border-gray-600 text-purple-500 focus:ring-purple-600"
              />
              <span className="ml-3 text-lg font-medium text-gray-200">
                Habilitar Comunicação MQTT
              </span>
            </label>
            <p className="text-sm text-gray-400 ml-8 mt-1">
              Marque esta opção para configurar um broker MQTT customizado para este dispositivo.
            </p>
          </div>

          {/* ✨ 3. O nosso componente é renderizado aqui condicionalmente ✨ */}
          {formData.enableMqtt && (
            <MqttConfigurator
              formData={formData}
              handleChange={handleChange}
            />
          )}

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'A Guardar...' : 'Guardar Dispositivo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
