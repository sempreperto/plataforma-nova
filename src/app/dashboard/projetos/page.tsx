"use client";

import Link from 'next/link';
import ProjectList from '@/components/ProjectList';
import { FiPlus } from 'react-icons/fi';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-100">Meus Projetos</h1>
          <Link
            href="/dashboard/projetos/novo"
            className="flex items-center gap-2 px-6 py-3 text-white font-bold rounded-full shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            <FiPlus size={20} />
            Criar Novo Projeto
          </Link>
        </div>
        <ProjectList />
      </div>
    </div>
  );
}
