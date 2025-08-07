// src/app/dashboard/projetos/[projetoId]/dispositivos/criar/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { FiSave, FiXCircle, FiLoader } from 'react-icons/fi';
import { useSession } from 'next-auth/react';

export default function NovoDispositivoPage() {
  const router = useRouter();
  const params = useParams();
  const projetoId = typeof params?.projetoId === 'string' ? params.projetoId : '';

  const { status } = useSession();

  const [nome, setNome] = useState('');
  const [modelo, setModelo] = useState('XIAO ESP32-S3');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    if (!nome.trim() || !modelo.trim() || !projetoId) {
      setError('Nome, modelo e ID do projeto são obrigatórios.');
      setIsSaving(false);
      return;
    }

    try {
      const res = await fetch('/api/dispositivos/novo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nome, modelo, projetoId }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Falha ao criar o dispositivo.');
      }

      setSuccess(`Dispositivo "${data.name}" criado com sucesso! A redirecionar...`);
      setNome('');
      setModelo('XIAO ESP32-S3');

      setTimeout(() => {
        router.push(`/dashboard/projetos/${projetoId}`);
        router.refresh();
      }, 2500);

    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro desconhecido.');
    } finally {
      setIsSaving(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-blue-300">
        <FiLoader className="animate-spin mr-2" size={32} />
        <span>Carregando...</span>
      </div>
    );
  }

  if (!projetoId && status === 'authenticated') {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-red-400 p-4">
              <FiXCircle size={28} className="mr-2" />
              <span className="text-xl font-semibold text-center">Erro: ID do Projeto não encontrado na URL.</span>
              <Link href="/dashboard" className="mt-4 text-blue-400 hover:underline">Voltar ao Dashboard</Link>
          </div>
      );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-lg bg-gray-800 bg-opacity-70 rounded-2xl shadow-xl p-8 border border-gray-700 text-gray-100">
        <h1 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
          Registrar Novo Módulo
        </h1>
        <p className="text-gray-400 mb-8">
          Adicione um novo dispositivo ao seu projeto.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-300 mb-2">Nome do Módulo</label>
            <input
              type="text"
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-500 transition"
              required
              placeholder="Ex: Sensor de Temperatura da Sala"
              disabled={isSaving || !!success}
            />
          </div>

          <div>
            <label htmlFor="modelo" className="block text-sm font-medium text-gray-300 mb-2">Modelo do Hardware</label>
            <select
              id="modelo"
              value={modelo}
              onChange={(e) => setModelo(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white transition"
              disabled={isSaving || !!success}
            >
              <option value="seeed_xiao_esp32s3">XIAO ESP32-S3</option>
              <option value="esp32-s3-devkitc-1">ESP32-S3 DevKitC-1</option>
              <option value="esp32dev">ESP32 Dev Module</option>
              <option value="XIAO ESP32-S3">XIAO ESP32-S3</option>
              <option value="ESP32">ESP32 Genérico</option>
              <option value="ESP8266">ESP8266</option>
              <option value="Raspberry Pi Pico W">Raspberry Pi Pico W</option>
              <option value="Outro">Outro</option>
            </select>
          </div>

          {error && <div className="bg-red-800 bg-opacity-50 border-l-4 border-red-500 text-red-300 p-4 rounded-md"><p>{error}</p></div>}
          {success && <div className="bg-green-800 bg-opacity-50 border-l-4 border-green-500 text-green-300 p-4 rounded-md"><p>{success}</p></div>}

          <div className="flex flex-col sm:flex-row-reverse sm:justify-start gap-3 pt-4">
            <button
              type="submit"
              disabled={isSaving || !projetoId || !!success}
              className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-6 py-3 border border-transparent text-lg font-medium rounded-full shadow-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
            >
              {isSaving ? (
                <><FiLoader className="animate-spin" /> Registrando...</>
              ) : (
                <><FiSave /> Guardar Módulo</>
              )}
            </button>
            <Link href={projetoId ? `/dashboard/projetos/${projetoId}` : '/dashboard'} className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-6 py-3 border border-gray-600 text-lg font-medium rounded-full shadow-md text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-all duration-300">
              <FiXCircle />
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
