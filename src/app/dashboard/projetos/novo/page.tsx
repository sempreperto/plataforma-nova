"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft, FiPlus, FiLoader } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function NovoProjetoPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("O nome do projeto não pode estar vazio.");
      return;
    }
    setIsSubmitting(true);
    const toastId = toast.loading('A criar projeto...');

    try {
      const response = await fetch('/api/projetos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao criar o projeto.');
      }
      const newProject = await response.json();
      toast.success('Projeto criado com sucesso!', { id: toastId });
      router.push(`/dashboard/projetos/${newProject.id}`);
    } catch (error: any) {
      toast.error(`Erro: ${error.message}`, { id: toastId });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-8 text-gray-100">
      <div className="mx-auto max-w-2xl">
        <header className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors">
            <FiArrowLeft /> Voltar para o Dashboard
          </Link>
          <h1 className="mt-4 text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            Criar Novo Projeto
          </h1>
        </header>
        <Card className="bg-gray-800/70 backdrop-blur-sm border-gray-700">
          <CardHeader>
            <CardTitle>Detalhes do Projeto</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Nome do Projeto
                </label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Automação da Sala de Estar"
                  className="bg-gray-900 border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-6 py-3 text-white font-bold rounded-full shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all">
                  {isSubmitting ? (
                    <><FiLoader className="animate-spin" /> A Criar...</>
                  ) : (
                    <><FiPlus /> Criar Projeto</>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
