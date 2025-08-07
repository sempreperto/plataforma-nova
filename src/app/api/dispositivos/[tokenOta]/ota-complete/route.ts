// Ficheiro: src/app/api/dispositivos/[tokenOta]/ota-complete/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Esta rota é chamada pelo dispositivo, que se autentica com um token "Bearer".
// Não há sessão de usuário aqui.
export async function POST(
  request: Request,
  { params }: { params: { tokenOta: string } }
) {
  const { tokenOta } = params;

  // Segurança: Verificamos se o token no header corresponde ao token na URL.
  // Esta lógica é a mesma da sua função `verifyDeviceToken`.
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ message: 'Acesso negado: Header de autorização ausente.' }, { status: 403 });
  }
  const tokenFromHeader = authHeader.split(' ')[1];
  if (tokenFromHeader !== tokenOta) {
    return NextResponse.json({ message: 'Acesso negado: Token inválido.' }, { status: 403 });
  }

  try {
    // Define a flag de atualização pendente de volta para 'false'
    await prisma.dispositivo.updateMany({
      where: { tokenOta: tokenOta },
      data: { otaUpdatePending: false },
    });

    console.log(`[OTA Complete] Confirmação de conclusão recebida para o token: ${tokenOta}`);
    return NextResponse.json({ message: 'Confirmação OTA recebida com sucesso.' }, { status: 200 });

  } catch (error) {
    console.error("Erro ao completar o ciclo OTA:", error);
    return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
  }
}
