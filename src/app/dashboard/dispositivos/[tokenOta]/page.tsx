import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { FiAlertTriangle, FiCpu, FiWifi } from 'react-icons/fi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

interface Props {
  params: {
    tokenOta: string;
  };
}

export default async function DispositivoPage({ params }: Props) {
  const device = await prisma.device.findUnique({
    where: { tokenOta: params.tokenOta },
    include: { projeto: true },
  });

  if (!device) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-3 text-red-500">
        <FiAlertTriangle size={32} />
        <p>Dispositivo não encontrado.</p>
        <Link href="/dashboard" className="text-purple-400">Voltar</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <Link
        href={`/dashboard/projetos/${device.projeto.id}`}
        className="inline-flex items-center gap-2 text-gray-400 hover:text-purple-400 mb-4"
      >
        ← Voltar ao projeto
      </Link>

      <Card className="bg-gray-800 text-white border-gray-700">
        <CardHeader>
          <CardTitle>{device.name || 'Dispositivo sem nome'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <FiCpu className="text-purple-400" />
            <span className="text-gray-400">Modelo: {device.modelo || 'Desconhecido'}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiWifi className="text-purple-400" />
            <span className="text-gray-400">Último IP: {device.ultimoIp || 'Indefinido'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-purple-400 font-mono text-xs bg-gray-700 px-2 py-1 rounded">
              Token OTA: {device.tokenOta}
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Link
          href={`/dashboard/dispositivos/${device.tokenOta}/settings`}
          className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
        >
          ⚙️ Configurações
        </Link>
      </div>
    </div>
  );
}
