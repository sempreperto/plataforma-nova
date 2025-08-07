// Ficheiro: src/app/dashboard/dispositivos/[tokenOta]/settings/page.tsx (NOVO FICHEIRO CORRIGIDO)
"use client";

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { FiArrowLeft, FiSave, FiLoader, FiAlertTriangle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { FirmwareFlasher } from '@/components/FirmwareFlasher'; // <-- IMPORTAÇÃO NOMEADA (COM CHAVES)

// Supondo que você tem estas interfaces definidas em algum lugar
interface Dispositivo {
  id: string;
  name: string;
  tokenOta: string;
  modelo: string;
  // Adicione outros campos que você busca da API
}

export default function DeviceSettingsPage() {
  const params = useParams();
  const tokenOta = params?.tokenOta as string;
  const [formData, setFormData] = useState<Partial<Dispositivo>>({ name: '', modelo: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Busca os dados atuais do dispositivo para preencher o formulário
  const fetchDeviceDetails = useCallback(async () => {
    if (!tokenOta) return;
    try {
      setLoading(true);
      // Supondo que você tenha uma API para buscar detalhes de um dispositivo
      const response = await fetch(`/api/dispositivos/${tokenOta}`);
      if (!response.ok) throw new Error('Dispositivo não encontrado.');
      const data = await response.json();
      setFormData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [tokenOta]);

  useEffect(() => {
    fetchDeviceDetails();
  }, [fetchDeviceDetails]);

  // Função para salvar as alterações (a ser implementada)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Configurações salvas!");
    // Aqui você implementaria a chamada à API para salvar os dados do formData
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><FiLoader className="animate-spin" /> Carregando...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500"><FiAlertTriangle /> {error}</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <Link href={`/dashboard/dispositivos/${tokenOta}`} className="inline-flex items-center gap-2 text-gray-400 hover:text-purple-400 mb-8">
          <FiArrowLeft /> Voltar para o Dispositivo
        </Link>
        <h1 className="text-4xl font-bold mb-8">Configurações de {formData.name || 'Dispositivo'}</h1>

        {/* Formulário de Configurações */}
        <form onSubmit={handleSave} className="space-y-6 bg-gray-800 p-8 rounded-lg">
          <div>
            <label htmlFor="name" className="block mb-2">Nome do Dispositivo</label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 bg-gray-700 rounded"
            />
          </div>
          {/* Adicione outros campos do formulário aqui */}

          <div className="flex justify-end">
            <button type="submit" className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">
              <FiSave /> Salvar Alterações
            </button>
          </div>
        </form>

        {/* Seção de Ações Perigosas */}
        <div className="mt-12 p-8 border border-red-500/50 rounded-lg bg-gray-800">
          <h2 className="text-2xl font-bold text-red-400">Zona de Perigo</h2>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <h3 className="font-bold">Reinstalar Firmware</h3>
              <p className="text-sm text-gray-400">
                Use esta opção se precisar de reinstalar um firmware base manualmente via USB.
              </p>
            </div>
            <FirmwareFlasher
              triggerText="Reinstalar Firmware (USB)"
              boardModel={formData.modelo || ''}
              firmwareType="provisioning"
              buttonClassName="bg-yellow-600 hover:bg-yellow-700"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
