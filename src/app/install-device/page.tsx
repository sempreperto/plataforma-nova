// src/app/install-device/page.tsx (PÁGINA FINAL SIMPLES QUE CHAMA O FLASHER ANTIGO)
"use client";

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { FiLoader } from 'react-icons/fi';

// Mapeamento fixo para a placa padrão (Seeed XIAO ESP32S3)
const DEFAULT_BOARD_INFO = {
    name: "Seeed XIAO ESP32S3",
    // A URL do manifesto não é usada diretamente pelo FlasherContent nesta versão,
    // mas a API de geração precisa dos arquivos binários.
    // Vamos gerar o firmware na API e passar os binários em base64.
    // O FlasherContent espera "firmwareFiles" que é um objeto { firmware, bootloader, partitions }
    manifestUrl: "/firmwares_prontos/seeed_xiao_esp32s3/provisioning/manifest.json",
    image: "/screenshots/xiao_esp32s3.jpg"
};

// Carregamento dinâmico do FlasherContent.
// Ele receberá os arquivos binários em base64.
const FlasherContent = dynamic(() => import('@/components/FlasherContent'), {
    ssr: false,
    loading: () => (
        <div className="text-center p-8">
            <FiLoader className="animate-spin inline-block text-purple-400 text-4xl" />
            <p className="text-white mt-4">Preparando o instalador...</p>
        </div>
    )
});

// NOVO: Adicionar estado para os arquivos do firmware para passar para o FlasherContent
import { useState, useEffect } from 'react';
import { FiAlertCircle } from 'react-icons/fi';


export default function InstallDevicePage() {
    const [firmwareFiles, setFirmwareFiles] = useState<{ firmware: string; bootloader: string; partitions: string; } | null>(null);
    const [loadingFirmware, setLoadingFirmware] = useState(true);
    const [errorLoadingFirmware, setErrorLoadingFirmware] = useState<string | null>(null);

    useEffect(() => {
        const loadFirmwareBinaries = async () => {
            setLoadingFirmware(true);
            setErrorLoadingFirmware(null);
            try {
                // AQUI VAMOS CHAMAR A API DE GERAÇÃO PARA OBTER OS BINÁRIOS EM BASE64
                // É o caminho que funcionava antes, antes de tentar o manifest/web-tools.
                // A API /api/firmware/generate precisa ser restaurada para retornar os base64

                const response = await fetch('/api/firmware/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ssid: "NA", // Valores mock, já que o firmware de provisionamento vai pedir
                        password: "NA", // A API de geração precisa desses campos
                        projectId: "NA",
                        tokenOta: "NA",
                        modeloPlaca: "seeed_xiao_esp32s3", // Modelo fixo
                        tipoFirmware: "padrao", // Tipo fixo
                        feature: ""
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Falha ao gerar o firmware.");
                }

                const data = await response.json();
                setFirmwareFiles({
                    firmware: data.firmware,
                    bootloader: data.bootloader,
                    partitions: data.partitions,
                });
            } catch (err: any) {
                setErrorLoadingFirmware(`Erro ao carregar firmware: ${err.message}`);
                console.error("Erro ao carregar firmware binários:", err);
            } finally {
                setLoadingFirmware(false);
            }
        };

        loadFirmwareBinaries();
    }, []); // Roda uma vez ao montar

    if (errorLoadingFirmware) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4 text-white">
                <div className="text-center text-red-400 p-8 rounded-lg shadow-lg bg-gray-800/70">
                    <FiAlertCircle className="text-5xl mx-auto mb-4"/>
                    <h3 className="text-xl font-bold">Erro</h3>
                    <p className="text-sm mt-2">{errorLoadingFirmware}</p>
                </div>
            </div>
        );
    }

    if (loadingFirmware || !firmwareFiles) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4 text-white">
                <div className="text-center p-8">
                    <FiLoader className="animate-spin inline-block text-purple-400 text-4xl" />
                    <p className="text-white mt-4">Preparando o firmware para instalação...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 sm:p-8 text-gray-100">
            <div className="mx-auto max-w-lg bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-700 text-center">
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
                    Instalar Seu Dispositivo Soneh
                </h1>
                <p className="text-gray-400 mb-6">
                    Conecte sua placa {DEFAULT_BOARD_INFO.name} ao computador via cabo USB para instalar o firmware.
                </p>

                {DEFAULT_BOARD_INFO.image && (
                    <div className="mb-6 mx-auto">
                        <Image
                            src={DEFAULT_BOARD_INFO.image}
                            alt={DEFAULT_BOARD_INFO.name}
                            width={150}
                            height={150}
                            className="rounded-lg mx-auto object-cover border border-gray-700 shadow-md"
                        />
                    </div>
                )}

                {/* O FlasherContent é renderizado diretamente aqui, passando os binários */}
                <div className="mt-8">
                    <FlasherContent
                        firmwareFiles={firmwareFiles}
                        board={DEFAULT_BOARD_INFO.name}
                    />
                </div>

                <p className="text-gray-500 text-xs mt-6">
                    A instalação é segura e facilitada pela tecnologia do ESP-Web-Tools.
                </p>
            </div>
        </div>
    );
}
