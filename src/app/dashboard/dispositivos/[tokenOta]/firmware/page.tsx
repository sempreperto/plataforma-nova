// src/app/dashboard/dispositivos/[tokenOta]/firmware/page.tsx (VERSÃO CORRIGIDA)
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiCamera, FiMic, FiUploadCloud, FiLoader, FiCheckCircle, FiArrowLeft, FiAlertTriangle, FiCpu } from 'react-icons/fi';
// --- Interfaces ---
interface Dispositivo {
  name: string;
  tokenOta: string;
  targetFirmware: string | null;
}

// Componente Reutilizável para o Card de Firmware (VERSÃO MELHORADA)
const FirmwareCard = ({ icon, title, description, feature, onInstall, isLoading, isCurrent }: { icon: React.ReactNode; title: string; description: string; feature: string; onInstall: (feature: string) => void; isLoading: boolean; isCurrent: boolean; }) => {
  return (
    <div className={`bg-gray-800/50 border rounded-lg p-6 flex flex-col ${isCurrent ? 'border-green-500' : 'border-gray-700'}`}>
      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-purple-500/10 text-purple-400 rounded-full mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white">{title}</h3>
      <p className="text-gray-400 mt-2 flex-grow">{description}</p>

      {/* ✨ ALTERAÇÃO PRINCIPAL AQUI ✨ */}
      {/* O botão agora está sempre visível, mas muda de cor e texto */}
      <button
        onClick={() => onInstall(feature)}
        disabled={isLoading}
        className={`w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 font-bold rounded-lg transition-all disabled:opacity-50 ${
          isCurrent
          ? 'bg-green-600 hover:bg-green-700 text-white'
          : 'bg-indigo-600 hover:bg-indigo-700 text-white'
        }`}
      >
        {isLoading ? <FiLoader className="animate-spin" /> : <FiUploadCloud />}
        {/* O texto do botão muda se já for o atual */}
        {isCurrent ? 'Reinstalar' : 'Instalar (via OTA)'}
      </button>
    </div>
  );
};

export default function FirmwareManagerPage() {
  const params = useParams();
  const router = useRouter();
  // ✨ ALTERAÇÃO 1: Lemos 'tokenOta' do URL
  const tokenOta = params?.tokenOta as string;

  const [device, setDevice] = useState<Dispositivo | null>(null);
  const [loadingDevice, setLoadingDevice] = useState(true);
  const [isInstalling, setIsInstalling] = useState(false);
  const [message, setMessage] = useState('');

  const fetchDeviceData = useCallback(async () => {
    if (!tokenOta) return;
    try {
        // ✨ ALTERAÇÃO 2: Usamos o URL da API correto e padronizado
        const res = await fetch(`/api/dispositivos/${tokenOta}`);
        if (!res.ok) throw new Error("Dispositivo não encontrado.");
        const data = await res.json();
        setDevice(data);
    } catch (err) {
        console.error(err);
    } finally {
        setLoadingDevice(false);
    }
  }, [tokenOta]);

  useEffect(() => {
    if (tokenOta) {
        fetchDeviceData();
    }
  }, [tokenOta, fetchDeviceData]);

  const handleInstall = async (feature: string) => {
    if (!window.confirm(`Tem a certeza que deseja instalar o firmware de '${feature}'? A placa irá reiniciar.`)) {
      return;
    }
    setIsInstalling(true);
    setMessage('');
    try {
      // ✨ ALTERAÇÃO 3: Usamos o URL da API correto para agendar o OTA
      const res = await fetch(`/api/dispositivos/${tokenOta}/ota`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feature }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMessage(data.message + " A placa irá reiniciar em breve.");
      // Redireciona de volta para a página de detalhes após agendar
      setTimeout(() => router.push(`/dashboard/dispositivos/${tokenOta}`), 4000);
    } catch (err: any) {
      alert(`Erro: ${err.message}`);
      setIsInstalling(false);
    }
  };

  if (loadingDevice) return <div className="flex h-screen items-center justify-center text-white"><FiLoader className="animate-spin mr-2" /> A carregar...</div>;
  if (!device) return <div className="flex h-screen items-center justify-center text-red-500"><FiAlertTriangle/> Dispositivo não encontrado.</div>;

  return (
    <div className="min-h-screen bg-gray-900 p-8 text-gray-100">
      <div className="max-w-4xl mx-auto">
        <Link href={`/dashboard/dispositivos/${tokenOta}`} className="inline-flex items-center gap-2 text-gray-400 hover:text-purple-400 mb-6">
          <FiArrowLeft /> Voltar ao Dispositivo
        </Link>
        <h1 className="text-3xl font-bold mb-2">Gestor de Firmware para "{device.name}"</h1>
        <p className="text-gray-400 mb-8">Escolha a funcionalidade principal para o seu dispositivo. O novo firmware será enviado remotamente (via OTA).</p>

        {message && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-center flex items-center justify-center gap-2">
            <FiCheckCircle className="text-green-400" /> {message}
          </div>
        )}

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <FirmwareCard
    icon={<FiCamera size={24} />}
    title="Firmware de Câmera"
    feature="camera"
    description="Ativa a câmara para capturar e enviar fotos. Ideal para vigilância e monitorização visual."
    onInstall={handleInstall}
    isLoading={isInstalling}
    isCurrent={device.targetFirmware === 'camera.bin'}
  />

  {/* O card de Áudio que já existe */}
  <FirmwareCard
    icon={<FiMic size={24} />}
    title="Firmware de Áudio"
    feature="audio"
    description="(Em breve) Ativa o microfone para capturar e processar som."
    onInstall={handleInstall}
    isLoading={isInstalling}
    isCurrent={device.targetFirmware === 'audio.bin'}
  />

  {/* ✨ CARD ADICIONADO AQUI ✨ */}
  <FirmwareCard
    icon={<FiCpu size={24} />}
    title="Firmware Padrão"
    feature="padrao"
    description="Versão base do firmware, sem funcionalidades extras. Ideal para testes e dispositivos simples."
    onInstall={handleInstall}
    isLoading={isInstalling}
    isCurrent={device.targetFirmware === 'padrao.bin'}
  />
</div>
      </div>
    </div>
  );
}
