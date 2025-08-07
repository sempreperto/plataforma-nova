import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import { updateDevice, deleteDevice } from '@/lib/device.service';

// --- FUNÇÃO GET PARA BUSCAR UM DISPOSITIVO ---
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
    const device = await prisma.dispositivo.findFirst({
      where: {
        tokenOta: tokenOta,
        userId: session.user.id
      },
      include: {
        pinMappings: { orderBy: { pinNumber: 'asc' } },
        imageCaptures: { orderBy: { capturedAt: 'desc' }, take: 10 }
      }
    });

    if (!device) {
      return NextResponse.json({ message: "Dispositivo não encontrado ou acesso negado." }, { status: 404 });
    }
    return NextResponse.json(device);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// --- FUNÇÃO PUT PARA ATUALIZAR UM DISPOSITIVO ---
export async function PUT(
  request: Request,
  { params }: { params: { tokenOta: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
  }

  const { tokenOta } = params;
  const data = await request.json();

  try {
    const device = await prisma.dispositivo.findFirst({
        where: { tokenOta: tokenOta, userId: session.user.id }
    });
    if (!device) {
        return NextResponse.json({ message: "Dispositivo não encontrado ou acesso negado." }, { status: 404 });
    }
    const updated = await updateDevice(device.id, session.user.id, data);
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// --- FUNÇÃO DELETE PARA APAGAR UM DISPOSITIVO E SEUS DADOS RELACIONADOS ---
export async function DELETE(
  request: Request,
  { params }: { params: { tokenOta: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
  }

  const { tokenOta } = params;

  try {
    const device = await prisma.dispositivo.findFirst({
        where: { tokenOta: tokenOta, userId: session.user.id }
    });

    if (!device) {
        return NextResponse.json({ message: "Dispositivo não encontrado ou acesso negado." }, { status: 404 });
    }

    // ✨ CORREÇÃO ADICIONADA AQUI ✨
    // Antes de apagar o dispositivo, apagamos todos os registos que dependem dele.
    await prisma.$transaction([
        prisma.imageCapture.deleteMany({ where: { dispositivoId: device.id } }),
        prisma.audioLog.deleteMany({ where: { dispositivoId: device.id } }),
        prisma.agendamento.deleteMany({ where: { dispositivoId: device.id } }),
        prisma.pinMapping.deleteMany({ where: { dispositivoId: device.id } }),
        // Finalmente, apagamos o próprio dispositivo
        prisma.dispositivo.delete({ where: { id: device.id } })
    ]);

    return NextResponse.json({ message: 'Dispositivo e todos os seus dados foram apagados com sucesso.' });

  } catch (error: any) {
    console.error(`Erro ao apagar dispositivo ${tokenOta}:`, error);
    return NextResponse.json({ message: "Erro interno ao apagar o dispositivo." }, { status: 500 });
  }
}
