import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';

// --- FUNÇÃO GET PARA LISTAR AGENDAMENTOS ---
export async function GET(
  request: Request,
  { params }: { params: { tokenOta: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
  }

  const { tokenOta } = params;

  try {
    const dispositivo = await prisma.dispositivo.findFirst({
      where: { tokenOta: tokenOta, userId: session.user.id },
    });

    if (!dispositivo) {
      return NextResponse.json({ message: 'Dispositivo não encontrado.' }, { status: 404 });
    }

    const agendamentos = await prisma.agendamento.findMany({
      where: { dispositivoId: dispositivo.id },
      include: { pinMapping: { select: { pinAlias: true } } },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json(agendamentos);
  } catch (error) {
    return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
  }
}

// --- FUNÇÃO POST PARA CRIAR AGENDAMENTOS ---
export async function POST(
  request: Request,
  { params }: { params: { tokenOta: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
  }

  const { tokenOta } = params;
  const body = await request.json();
  const { pinMappingId, action, cronExpression } = body;

  try {
    const dispositivo = await prisma.dispositivo.findFirst({
        where: { tokenOta, userId: session.user.id },
    });

    if (!dispositivo) {
        return NextResponse.json({ message: 'Dispositivo não encontrado ou acesso negado.' }, { status: 404 });
    }

    const novoAgendamento = await prisma.agendamento.create({
        data: {
          dispositivoId: dispositivo.id,
          pinMappingId,
          action,
          cronExpression,
        },
      });

    return NextResponse.json(novoAgendamento, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Erro ao criar agendamento.' }, { status: 500 });
  }
}
