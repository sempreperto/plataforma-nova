import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from '@/lib/prisma';
import { findProjectById } from '@/lib/project.service';

// --- FUNÇÃO GET ---
export async function GET(
  request: Request,
  context: { params: { projetoId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }

  const projetoId = context.params.projetoId;

  if (!projetoId) {
    return NextResponse.json({ message: 'ID do projeto é obrigatório.' }, { status: 400 });
  }

  try {
    const projeto = await findProjectById(projetoId, session.user.id);
    if (!projeto) {
      return NextResponse.json({ message: 'Projeto não encontrado ou acesso negado.' }, { status: 404 });
    }
    return NextResponse.json(projeto);
  } catch (error) {
    return NextResponse.json({ message: 'Erro interno ao buscar o projeto.' }, { status: 500 });
  }
}

// --- FUNÇÃO DELETE ---
export async function DELETE(
  request: Request,
  context: { params: { projetoId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const projetoId = context.params.projetoId;

  try {
    const projeto = await prisma.projeto.findFirst({
      where: { id: projetoId, userId: session.user.id },
      include: { _count: { select: { dispositivos: true } } },
    });

    if (!projeto) {
      return NextResponse.json({ error: "Projeto não encontrado ou acesso negado." }, { status: 404 });
    }

    if (projeto._count.dispositivos > 0) {
      return NextResponse.json({ error: "Não é possível excluir o projeto. Exclua todos os dispositivos primeiro." }, { status: 400 });
    }

    await prisma.projeto.delete({ where: { id: projetoId } });

    return NextResponse.json({ message: "Projeto deletado com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar projeto:", error);
    return NextResponse.json({ error: "Erro interno ao deletar o projeto." }, { status: 500 });
  }
}
