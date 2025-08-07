// Ficheiro: src/app/api/dispositivos/[tokenOta]/ota/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';

const VALID_FEATURES = ['camera', 'audio', 'padrao'];

export async function POST(
  request: Request,
  { params }: { params: { tokenOta: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
  }

  const { tokenOta } = params;
  const { feature } = await request.json();

  if (!tokenOta || typeof feature !== 'string' || !VALID_FEATURES.includes(feature)) {
    return NextResponse.json({ message: `Dados inválidos.` }, { status: 400 });
  }

  try {
    const dispositivo = await prisma.dispositivo.findFirst({
      where: { tokenOta: tokenOta, userId: session.user.id },
    });

    if (!dispositivo) {
      return NextResponse.json({ message: 'Dispositivo não encontrado ou acesso negado.' }, { status: 404 });
    }

    await prisma.dispositivo.update({
      where: { id: dispositivo.id },
      data: {
        // ✨ CORREÇÃO APLICADA AQUI ✨
        // Agora salvamos o nome completo do ficheiro .bin
        targetFirmware: `${feature}.bin`,
        otaUpdatePending: true,
      },
    });

    return NextResponse.json({ message: `Atualização para o firmware de '${feature}' agendada com sucesso!` });

  } catch (error) {
    return NextResponse.json({ message: 'Erro interno ao agendar a atualização.' }, { status: 500 });
  }
}
