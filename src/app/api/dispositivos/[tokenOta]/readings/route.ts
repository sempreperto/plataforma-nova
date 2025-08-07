import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyDeviceToken } from '@/lib/deviceAuth'; // Sua função de segurança

// --- FUNÇÃO POST PARA RECEBER NOVAS LEITURAS ---
export async function POST(
  request: Request,
  { params }: { params: { tokenOta: string } }
) {
  const { tokenOta } = params;

  // Segurança: Verifica se o dispositivo é quem ele diz ser
  if (!await verifyDeviceToken(request, tokenOta)) {
      return NextResponse.json({ message: 'Acesso negado.' }, { status: 403 });
  }

  try {
    const { type, value, unit } = await request.json();
    if (!type || value === undefined || !unit) {
      return NextResponse.json({ error: 'Campos type, value e unit são obrigatórios.' }, { status: 400 });
    }

    const dispositivo = await prisma.dispositivo.findUnique({ where: { tokenOta } });
    if (!dispositivo) {
      return NextResponse.json({ error: 'Dispositivo não encontrado.' }, { status: 404 });
    }

    await prisma.sensorReading.create({
      data: {
        dispositivoId: dispositivo.id,
        type: String(type),
        value: parseFloat(value),
        unit: String(unit),
      },
    });

    return new NextResponse(null, { status: 201 }); // 201 Created

  } catch (error) {
    console.error(`[API Readings] Erro ao salvar leitura para ${tokenOta}:`, error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}

// --- FUNÇÃO GET PARA ENVIAR LEITURAS PARA O FRONTEND ---
export async function GET(
  request: Request,
  { params }: { params: { tokenOta: string } }
) {
  // Aqui você adicionaria a segurança de sessão do usuário (getServerSession)

  const { tokenOta } = params;
  try {
    const readings = await prisma.sensorReading.findMany({
      where: { dispositivo: { tokenOta } },
      orderBy: { timestamp: 'asc' },
      take: 100 // Pega as últimas 100 leituras para o gráfico
    });
    return NextResponse.json(readings);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar leituras.' }, { status: 500 });
  }
}
