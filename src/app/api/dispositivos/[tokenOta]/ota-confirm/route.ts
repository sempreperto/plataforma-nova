// Ficheiro: src/app/api/dispositivos/[tokenOta]/ota-confirm/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Esta rota é chamada pelo dispositivo, então não precisa de sessão de usuário.
// A segurança é feita pelo próprio token na URL.
export async function POST(
  request: Request,
  { params }: { params: { tokenOta: string } }
) {
  const { tokenOta } = params;
  if (!tokenOta) {
    return NextResponse.json({ message: 'Token do dispositivo é obrigatório.' }, { status: 400 });
  }

  try {
    await prisma.dispositivo.update({
      where: { tokenOta: tokenOta },
      data: { otaUpdatePending: false }, // Confirma que a atualização foi recebida
    });

    console.log(`[OTA Confirm] Atualização confirmada para o dispositivo: ${tokenOta}`);
    return NextResponse.json({ message: 'Confirmação de OTA recebida.' }, { status: 200 });

  } catch (error) {
    console.error(`[OTA Confirm] Erro ao confirmar atualização para ${tokenOta}:`, error);
    return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
  }
}
