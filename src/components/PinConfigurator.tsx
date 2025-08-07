// src/components/PinConfigurator.tsx (VERSÃO CORRIGIDA)
"use client";

import { useState } from 'react';
import { FiPlus, FiLoader } from 'react-icons/fi';

interface PinConfiguratorProps {
  tokenOta: string;
  onPinAdded: () => void;
}

export default function PinConfigurator({ tokenOta, onPinAdded }: PinConfiguratorProps) {
  const [pinNumber, setPinNumber] = useState('');
  const [pinAlias, setPinAlias] = useState('');
  const [deviceType, setDeviceType] = useState('RELAY');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // ✨ ALTERAÇÃO AQUI: A chamada agora é para '/api/pins' ✨
      const response = await fetch(`/api/pins`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokenOta: tokenOta, // Enviamos o token no corpo do pedido
          pinNumber: parseInt(pinNumber, 10),
          pinAlias,
          deviceType,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        // Mostra o erro que vem da API, que é mais específico
        throw new Error(data.message || 'Falha ao adicionar pino.');
      }

      // Limpa o formulário e atualiza a interface
      setPinNumber('');
      setPinAlias('');
      onPinAdded(); // Esta função atualiza a lista de pinos na página

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // O JSX do formulário continua igual
  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 mt-8">
      <h3 className="text-xl font-bold mb-4">Adicionar Novo Pino</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label htmlFor="pinAlias" className="text-sm text-gray-400 mb-1 block">Nome do Pino</label>
          <input
            id="pinAlias" type="text" value={pinAlias}
            onChange={(e) => setPinAlias(e.target.value)}
            placeholder="Ex: Relé da Bomba"
            className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>
        <div>
          <label htmlFor="pinNumber" className="text-sm text-gray-400 mb-1 block">Nº do Pino (GPIO)</label>
          <input
            id="pinNumber" type="number" value={pinNumber}
            onChange={(e) => setPinNumber(e.target.value)}
            placeholder="Ex: 12"
            className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>
        <div>
          <label htmlFor="deviceType" className="text-sm text-gray-400 mb-1 block">Tipo de Dispositivo</label>
          <select
            id="deviceType" value={deviceType}
            onChange={(e) => setDeviceType(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="RELAY">Relé (Liga/Desliga)</option>
            <option value="LED">LED (Liga/Desliga)</option>
            <option value="DIGITAL_SENSOR">Sensor Digital</option>
            <option value="ANALOG_SENSOR">Sensor Analógico</option>
          </select>
        </div>
        <button type="submit" disabled={isLoading} className="flex items-center justify-center gap-2 h-10 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:bg-gray-600 disabled:from-gray-600">
          {isLoading ? <FiLoader className="animate-spin" /> : <FiPlus />}
          Adicionar
        </button>
      </form>
      {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
    </div>
  );
}
