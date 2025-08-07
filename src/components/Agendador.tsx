// src/components/Agendador.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';
import { FiPlus, FiLoader, FiTrash2, FiAlertCircle } from 'react-icons/fi';

// --- Interfaces para os Tipos de Dados ---
interface PinMapping { id: string; pinAlias: string; }
interface Dispositivo { tokenOta: string; pinMappings: PinMapping[]; }
interface Agendamento { id: string; cronExpression: string; action: string; pinMapping: { pinAlias: string; }; }

interface AgendadorProps {
  dispositivo: Dispositivo;
}

export default function Agendador({ dispositivo }: AgendadorProps) {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para o formulário de novo agendamento
  const [selectedPin, setSelectedPin] = useState<string>('');
  const [selectedAction, setSelectedAction] = useState('ON');
  const [cronExpression, setCronExpression] = useState('* * * * *'); // Padrão: a cada minuto (para testes)

  const fetchAgendamentos = useCallback(async () => {
    try {
      const res = await fetch(`/api/dispositivos/${dispositivo.tokenOta}/agendamentos`);
      if (!res.ok) throw new Error('Falha ao buscar agendamentos.');
      const data = await res.json();
      setAgendamentos(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [dispositivo.tokenOta]);

  useEffect(() => {
    // Define o primeiro pino da lista como padrão no formulário
    if (dispositivo.pinMappings.length > 0) {
      setSelectedPin(dispositivo.pinMappings[0].id);
    }
    fetchAgendamentos();
  }, [dispositivo, fetchAgendamentos]);

  const handleDelete = async (agendamentoId: string) => {
    if (!window.confirm('Tem certeza que deseja apagar este agendamento?')) return;

    try {
      const res = await fetch(`/api/agendamentos/${agendamentoId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Falha ao apagar agendamento.');
      // Remove o agendamento da lista na interface sem precisar recarregar tudo
      setAgendamentos(prev => prev.filter(ag => ag.id !== agendamentoId));
    } catch (err: any) {
      alert(`Erro: ${err.message}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/dispositivos/${dispositivo.tokenOta}/agendamentos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pinMappingId: selectedPin,
          action: selectedAction,
          cronExpression: cronExpression,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Falha ao criar agendamento.');
      }
      // Recarrega a lista para mostrar o novo agendamento
      fetchAgendamentos();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Painel de Agendamento</h2>

      {/* Formulário para Adicionar Novo Agendamento */}
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 mb-8">
        <h3 className="text-xl font-bold mb-4">Criar Novo Agendamento</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div className="md:col-span-2">
            <label className="text-sm text-gray-400 mb-1 block">Pino a Controlar</label>
            <select value={selectedPin} onChange={(e) => setSelectedPin(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2">
              {dispositivo.pinMappings.map(pin => <option key={pin.id} value={pin.id}>{pin.pinAlias}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Ação</label>
            <select value={selectedAction} onChange={(e) => setSelectedAction(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2">
              <option value="ON">Ligar</option>
              <option value="OFF">Desligar</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Quando (CRON)</label>
            <input type="text" value={cronExpression} onChange={(e) => setCronExpression(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2" />
            <a href="https://crontab.guru/" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline">Ajuda com CRON</a>
          </div>
          <button type="submit" disabled={loading} className="flex items-center justify-center gap-2 h-10 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg">
            {loading ? <FiLoader className="animate-spin" /> : <FiPlus />}
            Agendar
          </button>
        </form>
        {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
      </div>

      {/* Lista de Agendamentos Existentes */}
      <h3 className="text-xl font-bold mb-4">Agendamentos Ativos</h3>
      <div className="space-y-4">
        {loading && agendamentos.length === 0 && <p className="text-gray-500">A carregar agendamentos...</p>}
        {!loading && agendamentos.length === 0 && <p className="text-gray-500">Nenhum agendamento configurado para este dispositivo.</p>}

        {agendamentos.map(ag => (
          <div key={ag.id} className="bg-gray-800/70 p-4 rounded-lg flex justify-between items-center border border-gray-700">
            <div>
              <p className="font-bold text-lg">{ag.action === 'ON' ? 'Ligar' : 'Desligar'} <span className="text-purple-400">{ag.pinMapping.pinAlias}</span></p>
              <p className="text-sm text-gray-400 font-mono">{ag.cronExpression}</p>
            </div>
            <button onClick={() => handleDelete(ag.id)} className="p-2 text-gray-500 hover:text-red-400">
              <FiTrash2/>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
