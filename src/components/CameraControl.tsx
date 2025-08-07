// Ficheiro: src/components/CameraControl.tsx
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { FiCamera, FiLoader, FiAlertCircle } from 'react-icons/fi';

// Define os tipos de dados que o componente espera receber
interface ImageCapture {
  id: string;
  filePath: string;
  capturedAt: string;
}
interface Dispositivo {
  tokenOta: string;
  imageCaptures: ImageCapture[];
}

interface CameraControlProps {
  dispositivo: Dispositivo;
  onCapture: () => void; // Função para recarregar os dados da página
}

export default function CameraControl({ dispositivo, onCapture }: CameraControlProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Encontra a imagem mais recente na lista de capturas
  const latestImage = dispositivo.imageCaptures?.[0];

  const handleTakePhoto = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Chama a API que envia o comando MQTT para a placa
      const response = await fetch(`/api/dispositivos/${dispositivo.tokenOta}/camera/trigger`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Falha ao enviar o comando para a placa.');
      }

      // Espera um pouco para a placa processar, tirar a foto e fazer o upload
      setTimeout(() => {
        onCapture(); // Chama a função para recarregar os dados e mostrar a nova foto
        setIsLoading(false);
      }, 5000); // 5 segundos de espera

    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 mt-8">
      <h3 className="text-xl font-bold mb-4 text-purple-300">Central da Câmara</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Painel da Imagem */}
        <div className="w-full aspect-video bg-black rounded-lg flex items-center justify-center overflow-hidden">
          {latestImage ? (
              <Image
                src={latestImage.filePath}
                alt={`Captura de ${new Date(latestImage.capturedAt).toLocaleString()}`}
                width={640}
                height={480}
                className="object-contain"
              />
          ) : (
            <div className="text-gray-500 flex flex-col items-center">
              <FiCamera size={48} />
              <p className="mt-2">Nenhuma imagem capturada ainda.</p>
            </div>
          )}
        </div>

        {/* Painel de Controlo */}
        <div className="text-center md:text-left">
          <p className="text-gray-400 mb-4">
            Clique no botão abaixo para solicitar uma nova captura de imagem do seu dispositivo em tempo real.
          </p>
          <button
            onClick={handleTakePhoto}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <FiLoader className="animate-spin" />
                A Capturar...
              </>
            ) : (
              <>
                <FiCamera />
                Tirar Nova Foto
              </>
            )}
          </button>
          {error && (
            <p className="text-red-400 text-sm mt-4 flex items-center justify-center gap-2">
              <FiAlertCircle /> {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
