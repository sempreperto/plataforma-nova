"use client";

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { io, Socket } from "socket.io-client"; // <-- ✨ AQUI ESTÁ A LINHA QUE FALTAVA ✨
import { FiArrowLeft, FiPlus, FiCpu, FiLoader, FiAlertTriangle, FiTrash2, FiCheckCircle, FiCopy, FiEdit2 } from 'react-icons/fi';
import { FirmwareFlasher } from '@/components/FirmwareFlasher';
import toast from 'react-hot-toast';
import ConfirmationDialog from '@/components/ui/ConfirmationDialog';

// --- Interfaces ---
interface Dispositivo {
  id: string;
  name: string;
  tokenOta: string;
  modelo: string;
  lastActivity: string | null;
  status: string;
}

interface Projeto {
  name: string;
  dispositivos: Dispositivo[];
}

export default function ProjetoDetalhesPage() {
  const params = useParams();
  const projetoId = params?.projetoId as string;

  const [projeto, setProjeto] = useState<Projeto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedTokenId, setCopiedTokenId] = useState<string | null>(null);

  const fetchProjetoDetalhes = useCallback(async () => {
    if (!projetoId) return;
    try {
      // O 'loading' só é ativado na primeira vez.
      if (!projeto) setLoading(true);

      const response = await fetch(`/api/projetos/${projetoId}`);
      if (!response.ok) throw new Error('Projeto não encontrado ou acesso negado.');
      const data = await response.json();
      setProjeto(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [projetoId, projeto]); // Dependência 'projeto' adicionada para lógica de loading

  useEffect(() => {
    fetchProjetoDetalhes();
  }, []); // Executa apenas uma vez ao montar

  // --- Lógica de Tempo Real com Socket.IO ---
  useEffect(() => {
    if (!projetoId) return;

    fetch('/api/socketio');
    const socket: Socket = io({ path: "/api/socket.io" });

    socket.on('connect', () => {
      console.log('Socket.IO: Conectado ao servidor!');
      socket.emit('joinProjectRoom', projetoId);
    });

    socket.on('device-status-update', (update: { tokenOta: string; lastActivity: string; status: string }) => {
      console.log('Socket.IO: Atualização de status recebida!', update);
      setProjeto(currentProjeto => {
        if (!currentProjeto) return null;
        const updatedDispositivos = currentProjeto.dispositivos.map(d => {
          if (d.tokenOta === update.tokenOta) {
            return { ...d, status: update.status, lastActivity: update.lastActivity };
          }
          return d;
        });
        return { ...currentProjeto, dispositivos: updatedDispositivos };
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [projetoId]);

  const handleDeleteDevice = async (tokenOta: string) => {
    const toastId = toast.loading('A apagar dispositivo...');
    try {
      const res = await fetch(`/api/dispositivos/${tokenOta}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Falha ao apagar o dispositivo.' }));
        throw new Error(data.error);
      }
      toast.success("Dispositivo apagado com sucesso!", { id: toastId });
      // Remove o dispositivo do estado local para uma UI mais rápida
      setProjeto(p => p ? { ...p, dispositivos: p.dispositivos.filter(d => d.tokenOta !== tokenOta) } : null);
    } catch (err: any) {
      toast.error(`Erro: ${err.message}`, { id: toastId });
    }
  };

  const copyToClipboard = (text: string, tokenId: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Token copiado!");
      setCopiedTokenId(tokenId);
      setTimeout(() => setCopiedTokenId(null), 2000);
    });
  };

  if (loading) return <div className="flex h-screen items-center justify-center gap-3 text-gray-400 bg-gray-900"><FiLoader className="animate-spin" size={24} /> Carregando...</div>;
  if (error || !projeto) return <div className="flex h-screen flex-col items-center justify-center gap-3 text-red-500 bg-gray-900"><FiAlertTriangle size={32} /><p>{error || 'Projeto não encontrado.'}</p><Link href="/dashboard" className="mt-4 text-blue-400 hover:underline">Voltar</Link></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 sm:p-8 text-gray-100">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 pb-6 border-b border-gray-700">
          <div>
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-purple-400 mb-3">
              <FiArrowLeft /> Voltar aos Projetos
            </Link>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              {projeto.name}
            </h1>
          </div>
          <div className="mt-6 sm:mt-0 flex-shrink-0">
            <Link href={`/dashboard/projetos/${projetoId}/dispositivos/criar`} className="flex items-center gap-2 px-6 py-3 text-white font-bold rounded-full shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all">
              <FiPlus size={20} />
              Adicionar Dispositivo
            </Link>
          </div>
        </header>
        <h2 className="text-3xl font-bold text-gray-100 mb-6">Dispositivos</h2>
        {projeto.dispositivos.length === 0 ? (
          <div className="text-center py-20 px-4 border-2 border-dashed border-gray-700 rounded-2xl bg-gray-800/50">
            <FiCpu size={60} className="mx-auto text-gray-500 mb-4" />
            <h3 className="text-2xl font-bold">Nenhum Dispositivo Encontrado</h3>
            <p className="text-gray-400 mt-2">Clique em "Adicionar Dispositivo" para começar.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projeto.dispositivos.map((dispositivo) => {
              const needsProvisioning = !dispositivo.lastActivity;
              const isOnline = dispositivo.status === 'ONLINE' && (Date.now() - new Date(dispositivo.lastActivity!).getTime()) < 30000;
              return (
                <div key={dispositivo.id} className="group flex flex-col justify-between bg-gray-800/70 p-6 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-lg transition-all hover:border-blue-500">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <FiCpu className="text-blue-400 flex-shrink-0" size={24} />
                        <Link href={`/dashboard/dispositivos/${dispositivo.tokenOta}`} className="truncate">
                          <h2 className="text-xl font-bold truncate group-hover:text-blue-400">{dispositivo.name}</h2>
                        </Link>
                      </div>
                      <span className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full ${isOnline ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                        <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400' : 'bg-red-400'}`}></div>
                        {isOnline ? 'Online' : 'Offline'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400 space-y-2 border-t border-gray-700 pt-4">
                      <p>Modelo: <span className="font-medium text-gray-200">{dispositivo.modelo}</span></p>
                      <div className="relative group/tooltip flex items-center">
                        <p>Token: <span className="font-mono text-xs ml-2">{dispositivo.tokenOta.substring(0, 8)}...</span></p>
                        <button onClick={() => copyToClipboard(dispositivo.tokenOta, dispositivo.id)} className="ml-2 p-1 text-gray-500 hover:text-blue-400 rounded-full hover:bg-gray-700">
                          {copiedTokenId === dispositivo.id ? <FiCheckCircle className="text-green-400" /> : <FiCopy />}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-700/50 flex items-center justify-end gap-4">
                    <ConfirmationDialog
                      title="Confirmar Exclusão"
                      description={`Tem a certeza que deseja excluir o dispositivo "${dispositivo.name}"? Esta ação não pode ser desfeita.`}
                      onConfirm={() => handleDeleteDevice(dispositivo.tokenOta)}
                    >
                      <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-400 transition-colors">
                        <FiTrash2 /> Excluir
                      </button>
                    </ConfirmationDialog>
                    {needsProvisioning && (
                      <FirmwareFlasher
                        triggerText="Instalar Firmware"
                        boardModel={dispositivo.modelo}
                        firmwareType="provisioning"
                        buttonClassName="w-auto px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg"
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
