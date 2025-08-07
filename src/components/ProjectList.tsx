"use client";
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FiLoader, FiTrash2 } from 'react-icons/fi';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import toast from 'react-hot-toast';
import ConfirmationDialog from '@/components/ui/ConfirmationDialog';

interface Projeto {
  id: string;
  name: string;
  createdAt: string;
}

export default function ProjectList() {
  const { status } = useSession();
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjetos = useCallback(async () => {
    try {
      if (status === 'authenticated') {
        const response = await fetch("/api/projetos");
        if (!response.ok) throw new Error("Falha ao buscar projetos");
        const data = await response.json();
        setProjetos(data);
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchProjetos();
  }, [fetchProjetos]);

  const handleDeleteProject = async (projetoId: string) => {
    const toastId = toast.loading('Apagando projeto...');
    try {
      const res = await fetch(`/api/projetos/${projetoId}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({ message: 'Falha ao apagar' }));
        throw new Error(data.message);
      }
      toast.success("Projeto excluído!", { id: toastId });
      fetchProjetos();
    } catch (err: any) {
      toast.error(`Erro: ${err.message}`, { id: toastId });
    }
  };

  if (loading) {
    return <div className="text-center p-8"><FiLoader className="animate-spin inline-block" /> Carregando...</div>;
  }

  if (projetos.length === 0) {
    return (
      <div className="text-center p-12 bg-gray-800/50 rounded-lg border border-dashed border-gray-700">
        <p className="text-gray-400">Nenhum projeto encontrado.</p>
        <p className="text-sm text-gray-500">Clique em "Criar Novo Projeto" para começar.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {projetos.map(projeto => (
        <Card key={projeto.id} className="group flex flex-col justify-between bg-gray-800/70 backdrop-blur-sm border-gray-700 hover:border-blue-500 text-white transition-all">
          <Link href={`/dashboard/projetos/${projeto.id}`} className="block h-full p-4">
            <CardHeader className="p-0">
              <CardTitle className="group-hover:text-blue-400">{projeto.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-0 mt-4">
              <p className="text-sm text-gray-400">
                Criado em:{" "}
                {format(new Date(projeto.createdAt), "dd 'de' MMMM yyyy", { locale: ptBR })}
              </p>
            </CardContent>
          </Link>
          <div className="mt-2 pt-2 border-t border-gray-700/50 flex justify-end px-4 pb-2">
            <ConfirmationDialog
              title="Confirmar Exclusão"
              description={`Tem a certeza de que deseja excluir o projeto "${projeto.name}"?`}
              onConfirm={() => handleDeleteProject(projeto.id)}
            >
              <button className="text-gray-500 hover:text-red-400 transition-colors" title="Excluir projeto">
                <FiTrash2 />
              </button>
            </ConfirmationDialog>
          </div>
        </Card>
      ))}
    </div>
  );
}
