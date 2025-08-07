// src/app/auth/complete-profile/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { getCsrfToken, useSession } from 'next-auth/react'; // Removido 'update' daqui
import { useRouter } from 'next/navigation';
import { FiLoader, FiSave, FiCheckCircle } from 'react-icons/fi';

export default function CompleteProfilePage() {
    // 'update' agora é desestruturado diretamente de useSession()
    const { data: session, status, update } = useSession(); // Inclui 'status' e 'update'
    const router = useRouter();
    const [name, setName] = useState('');
    const [telefone, setTelefone] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        // Se a sessão ainda está carregando, não faz nada.
        if (status === "loading") {
            return;
        }

        // Se a sessão já tiver um nome, preenche o campo.
        if (session?.user?.name) {
            setName(session.user.name);
        }

        // Se o telefone já estiver preenchido na sessão e o usuário estiver autenticado,
        // redireciona para o dashboard. Isso evita que o usuário fique preso nesta tela
        // se o dado já estiver lá e a sessão estiver atualizada.
        if (session?.user?.telefone && status === "authenticated") {
            router.push('/dashboard');
        }
    }, [session, status, router]); // Adiciona 'status' às dependências

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null); // Limpa a mensagem de sucesso ao tentar salvar novamente

        try {
            const csrfToken = await getCsrfToken();
            const res = await fetch('/api/auth/update-profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, telefone, csrfToken }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Falha ao atualizar o perfil.');
            }

            // A CHAVE: Atualiza a sessão do cliente com os novos dados
            // 'update' agora é garantidamente uma função vinda de useSession()
            await update({
                name: name,
                telefone: telefone
            });

            setSuccess("Perfil atualizado com sucesso! Redirecionando...");
            // O redirecionamento final ocorrerá via useEffect no ProfileCompletionChecker
            // ou diretamente aqui após a atualização da sessão.
            router.push('/dashboard');


        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4 text-white">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold">Falta pouco!</h1>
                    <p className="text-gray-400">Complete seu cadastro para continuar.</p>
                </div>
                <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-2xl shadow-lg space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Nome Completo</label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <div>
                        <label htmlFor="telefone" className="block text-sm font-medium text-gray-300 mb-2">Nº de WhatsApp (com DDD)</label>
                        <input
                            id="telefone"
                            type="tel"
                            value={telefone}
                            onChange={(e) => setTelefone(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ex: 11912345678"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    {/* Mostra mensagem de erro ou sucesso */}
                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                    {success && (
                        <div className="flex items-center justify-center gap-2 text-green-400">
                            <FiCheckCircle />
                            <p className="text-sm text-center">{success}</p>
                        </div>
                    )}

                    <div>
                        <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all">
                            {isLoading ?
                                (<FiLoader className="animate-spin" />) : (<FiSave />)}
                            {isLoading ?
                                ('A Salvar...') : ('Salvar e Continuar')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
