// Ficheiro: src/app/dashboard/gerador-firmware/page.tsx (VERSÃO FINAL E ORGANIZADA)
"use client";

import { useState } from "react";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FiCpu, FiGitMerge, FiHardDrive, FiLoader, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import Link from "next/link";
import { SUPPORTED_BOARDS } from "@/config/boards"; // <-- Importamos a nossa lista de placas

export default function GeradorFirmwarePage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    // O valor inicial agora é o ID da primeira placa na nossa lista de configuração
    const [modeloPlaca, setModeloPlaca] = useState(SUPPORTED_BOARDS[0].id);
    const [tipoFirmware, setTipoFirmware] = useState("camera");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    if (status === "loading") {
        return <div className="flex h-screen items-center justify-center text-white">Verificando permissões...</div>;
    }

    if (status === "unauthenticated" || session?.user?.role !== 'ADMIN') {
        router.replace('/dashboard');
        return null;
    }

    const handleGenerate = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const response = await fetch("/api/firmware/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ modeloPlaca, tipoFirmware }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (response.status === 409) {
                    setError("Uma compilação já está em andamento. Por favor, aguarde.");
                } else {
                    throw new Error(errorData.error || "Falha ao gerar o firmware.");
                }
                return;
            }

            const data = await response.json();
            setSuccessMessage(data.message);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-900 p-4">
            <div className="w-full max-w-lg p-8 space-y-8 bg-gray-800 rounded-xl shadow-lg">
                <h1 className="text-3xl font-bold text-center text-white">Gerador de Firmware (Admin)</h1>
                <p className="text-center text-gray-400">
                    Use esta ferramenta para compilar uma nova versão de firmware para ser distribuída via OTA.
                </p>

                {successMessage ? (
                    <div className="text-center">
                        <FiCheckCircle className="mx-auto text-green-400 text-5xl mb-4" />
                        <h2 className="text-2xl font-bold text-white mb-2">Sucesso!</h2>
                        <p className="text-gray-300">{successMessage}</p>
                        <button
                            onClick={() => setSuccessMessage(null)}
                            className="mt-6 text-blue-400 hover:underline"
                        >
                            Gerar outro firmware
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleGenerate} className="space-y-6">
                        <div className="relative">
                            <FiHardDrive className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <select
                                value={modeloPlaca}
                                onChange={(e) => setModeloPlaca(e.target.value)}
                                required
                                className="w-full bg-gray-700 text-white pl-10 pr-4 py-3 border border-gray-600 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {/* O dropdown agora é gerado dinamicamente a partir da nossa lista */}
                                {SUPPORTED_BOARDS.map(board => (
                                    <option key={board.id} value={board.id}>{board.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="relative">
                            <FiGitMerge className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <select value={tipoFirmware} onChange={(e) => setTipoFirmware(e.target.value)} required className="w-full bg-gray-700 text-white pl-10 pr-4 py-3 border border-gray-600 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="camera">Câmera</option>
                                <option value="padrao">Padrão</option>
                                <option value="provisioning">Provisioning (Instalação Inicial)</option>
                            </select>
                        </div>

                        {error && <p className="text-sm text-center text-red-400"><FiAlertCircle className="inline-block mr-2" />{error}</p>}

                        <button type="submit" disabled={loading} className="w-full flex justify-center items-center gap-3 py-3 px-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-500 transition-colors">
                            {loading ? (<><FiLoader className="animate-spin" /><span>A GERAR...</span></>) : (<><FiCpu /><span>GERAR FIRMWARE</span></>)}
                        </button>
                    </form>
                )}
                <div className="text-center mt-4">
                    <Link href="/dashboard" className="text-sm text-gray-400 hover:text-purple-400">
                        Voltar ao Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
