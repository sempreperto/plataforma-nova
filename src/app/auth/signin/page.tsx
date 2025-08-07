// src/app/auth/signin/page.tsx
"use client";

import React from 'react';
import { getProviders, signIn } from 'next-auth/react';
import { FiGithub, FiLoader } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc'; // Ícone colorido para o Google

type Provider = {
  id: string;
  name: string;
};

export default function SignInPage() {
  const [providers, setProviders] = React.useState<Record<string, Provider> | null>(null);

  React.useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };
    fetchProviders();
  }, []);

  // Objeto para mapear IDs de provedores a ícones para fácil customização
  const providerIcons: { [key: string]: React.ReactNode } = {
    github: <FiGithub size={22} />,
    google: <FcGoogle size={22} />,
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 p-4">

      {/* Cartão de Login */}
      <div className="w-full max-w-md bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-2xl p-8 sm:p-10 shadow-2xl shadow-purple-900/20">

        {/* Cabeçalho do Cartão */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
            Soneh.
          </h1>
          <p className="text-gray-400">
            Bem-vindo(a) de volta! Faça login para continuar.
          </p>
        </div>

        {/* Divisor de Provedores */}
        <div className="space-y-4">
          {providers ? (
            Object.values(providers).map((provider) => (
              <div key={provider.name}>
                <button
                  onClick={() => signIn(provider.id, { callbackUrl: '/dashboard' })}
                  className="w-full flex items-center justify-center gap-4 px-4 py-3 bg-gray-700/50 text-gray-200 font-semibold rounded-lg border border-gray-600 hover:bg-gray-700 hover:border-purple-500 transition-all duration-300 transform hover:scale-[1.03]"
                >
                  {/* Pega o ícone correto do nosso objeto 'providerIcons' */}
                  {providerIcons[provider.id.toLowerCase()] || null}
                  <span>Continuar com {provider.name}</span>
                </button>
              </div>
            ))
          ) : (
            <div className="flex justify-center text-gray-500">
              <FiLoader className="animate-spin" size={24} />
            </div>
          )}
        </div>

        {/* Linha Divisória */}
        <div className="relative flex items-center my-8">
            <div className="flex-grow border-t border-gray-700"></div>
            <span className="flex-shrink mx-4 text-xs text-gray-500 uppercase">Plataforma IoT</span>
            <div className="flex-grow border-t border-gray-700"></div>
        </div>

        <p className="text-center text-xs text-gray-500">
          Ao continuar, você concorda com nossos Termos de Serviço.
        </p>
      </div>

    </div>
  );
}
