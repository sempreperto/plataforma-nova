// src/app/auth/error/page.tsx
"use client";

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FiAlertTriangle } from 'react-icons/fi';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  let errorMessage = "Ocorreu um erro desconhecido durante a autenticação.";

  switch (error) {
    case 'OAuthAccountNotLinked':
      errorMessage = "Sua conta já está vinculada a outro provedor. Faça login com a conta original.";
      break;
    case 'EmailSignInError':
      errorMessage = "Não foi possível enviar o e-mail de login.";
      break;
    case 'Callback':
      errorMessage = "Erro no callback de autenticação. Verifique as configurações do provedor.";
      break;
    case 'OAuthCallback':
      errorMessage = "Erro no callback OAuth. Verifique as configurações do provedor (client ID/secret, URLs de redirecionamento).";
      break;
    case 'AccessDenied':
      errorMessage = "Acesso negado. Você não tem permissão para acessar esta página.";
      break;
    case 'Verification':
      errorMessage = "O token de verificação é inválido ou expirou.";
      break;
    default:
      errorMessage = `Erro de autenticação: ${error || 'desconhecido'}. Tente novamente.`;
      break;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-center max-w-md">
        <FiAlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-3">Erro de Autenticação</h1>
        <p className="text-gray-300 mb-6">{errorMessage}</p>
        <Link href="/auth/signin" className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
          Tentar Novamente
        </Link>
      </div>
    </div>
  );
}
