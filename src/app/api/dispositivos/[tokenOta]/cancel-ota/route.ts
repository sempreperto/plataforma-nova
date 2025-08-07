// Ficheiro: src/app/api/dispositivos/[tokenOta]/cancel-ota/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { tokenOta: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
  }

  const { tokenOta } = params;

  try {
    const updateResult = await prisma.dispositivo.updateMany({
      where: {
        tokenOta: tokenOta,
        userId: session.user.id,
      },
      data: {
        otaUpdatePending: false,
      },
    });

    if (updateResult.count === 0) {
      return NextResponse.json({ message: 'Dispositivo não encontrado ou acesso negado.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Atualização pendente cancelada com sucesso!' });

  } catch (error) {
    console.error("Erro ao cancelar OTA:", error);
    return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
  }
}
