// Ficheiro: src/app/api/dispositivos/[tokenOta]/command/route.ts
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
  const { command } = await request.json();

  if (!tokenOta || !command) {
    return NextResponse.json({ message: 'Token OTA e um comando são obrigatórios.' }, { status: 400 });
  }

  try {
    // Verificação de segurança crucial
    const dispositivo = await prisma.dispositivo.findFirst({
      where: {
        tokenOta: tokenOta,
        userId: session.user.id,
      },
    });

    if (!dispositivo) {
      return NextResponse.json({ message: 'Dispositivo não encontrado ou acesso negado.' }, { status: 404 });
    }

    // Atualiza o último comando no banco de dados
    await prisma.dispositivo.update({
      where: { tokenOta: tokenOta },
      data: { lastCommand: JSON.stringify(command) }
    });

    return NextResponse.json({ message: 'Comando enviado com sucesso.' }, { status: 200 });

  } catch (error) {
    console.error(`Erro ao enviar comando para ${tokenOta}:`, error);
    return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
  }
}
