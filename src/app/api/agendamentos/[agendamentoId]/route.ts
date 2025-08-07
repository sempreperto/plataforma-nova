// Ficheiro: src/app/api/agendamentos/[agendamentoId]/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: { agendamentoId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
  }

  const { agendamentoId } = params;

  try {
    // Segurança: Verifica se o agendamento a ser apagado pertence a um dispositivo do utilizador logado
    const agendamento = await prisma.agendamento.findFirst({
      where: {
        id: agendamentoId,
        dispositivo: { userId: session.user.id }
      }
    });

    if (!agendamento) {
      return NextResponse.json({ message: 'Agendamento não encontrado ou acesso negado.' }, { status: 404 });
    }

    await prisma.agendamento.delete({
      where: { id: agendamentoId },
    });

    // Retorna uma resposta de sucesso vazia, como é padrão para DELETE
    return new NextResponse(null, { status: 204 });

  } catch (error) {
    console.error(`[API Agendamentos DELETE] Erro para o ID ${agendamentoId}:`, error);
    return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
  }
}
