"use client";

import { useState } from 'react';
import { FiSend, FiLoader } from 'react-icons/fi';

export default function MqttPublisher() {
  // Valores padrão para facilitar o teste
  const [topic, setTopic] = useState('sempreperto/dispositivo/teste/comandos');
  const [payload, setPayload] = useState('{"pin":2,"action":"BLINK"}');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResponse(null);

    try {
      const res = await fetch('/api/mqtt/publishTest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic, message: payload }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Erro desconhecido');
      }
      setResponse(`Sucesso: ${data.message}`);
    } catch (err: any) {
      setResponse(`Erro: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 bg-gray-800/50 p-6 rounded-2xl border-2 border-dashed border-yellow-500">
      <h3 className="text-xl font-bold text-yellow-300 mb-4">Ferramenta de Depuração: Testar Conexão Servidor ➔ MQTT</h3>
      <p className="text-sm text-gray-400 mb-4">
        Use esta ferramenta para enviar uma mensagem diretamente do seu servidor para o broker MQTT. Isto testa a conexão do servidor, independentemente da placa.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-gray-400">Tópico MQTT</label>
          <input
            type="text"
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full mt-1 bg-gray-900 border border-gray-600 rounded-md px-3 py-2"
            required
          />
        </div>
        <div>
          <label htmlFor="payload" className="block text-sm font-medium text-gray-400">Mensagem (Payload)</label>
          <input
            type="text"
            id="payload"
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
            className="w-full mt-1 bg-gray-900 border border-gray-600 rounded-md px-3 py-2"
            required
          />
        </div>
        <div className="flex justify-end">
          <button type="submit" disabled={isLoading} className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-lg disabled:opacity-50">
            {isLoading ? <FiLoader className="animate-spin" /> : <FiSend />}
            Publicar Mensagem de Teste
          </button>
        </div>
      </form>
      {response && (
        <div className={`mt-4 text-sm p-3 rounded-md ${response.startsWith('Erro') ? 'bg-red-900/50 text-red-300' : 'bg-green-900/50 text-green-300'}`}>
          {response}
        </div>
      )}
    </div>
  );
}
