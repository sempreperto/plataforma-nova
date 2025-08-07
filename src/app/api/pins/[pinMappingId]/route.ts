// Ficheiro: src/app/api/pins/route.ts (VERSÃO CORRIGIDA COM VALIDAÇÃO DE SEGURANÇA)
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import { DeviceType } from '@prisma/client';
import { z } from 'zod'; // Importa a biblioteca de validação

// 1. Definição do Schema de Validação com Zod
// Isto garante que os dados recebidos têm o formato e tipo corretos.
const createPinSchema = z.object({
  tokenOta: z.string().min(1, "Token do dispositivo é obrigatório."),
  pinNumber: z.number().int().min(0, "O número do pino deve ser positivo.").max(48, "Número de pino inválido para um ESP32."),
  pinAlias: z.string().min(1, "O nome do pino é obrigatório.").max(50, "O nome do pino deve ter no máximo 50 caracteres."),
  deviceType: z.nativeEnum(DeviceType, {
    errorMap: () => ({ message: "Tipo de dispositivo inválido." }),
  }),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
  }

  try {
    const body = await request.json();

    // 2. Validação dos Dados
    // O método .parse() irá automaticamente lançar um erro se os dados não corresponderem ao schema
    const validatedData = createPinSchema.parse(body);
    const { tokenOta, pinNumber, pinAlias, deviceType } = validatedData;

    // A sua lógica de segurança existente permanece
    const dispositivo = await prisma.dispositivo.findFirst({
      where: {
        tokenOta: tokenOta,
        userId: session.user.id,
      },
      select: { id: true }
    });

    if (!dispositivo) {
      return NextResponse.json({ message: 'Dispositivo não encontrado ou acesso negado.' }, { status: 404 });
    }

    // 3. Utilização dos Dados Validados
    // Agora temos a certeza de que os dados são seguros para serem usados na base de dados
    const novoPinMapping = await prisma.pinMapping.create({
      data: {
        pinNumber,
        pinAlias,
        deviceType,
        dispositivoId: dispositivo.id,
        currentState: (deviceType === 'LED' || deviceType === 'RELAY') ? 'OFF' : 'N/A',
      },
    });

    return NextResponse.json(novoPinMapping, { status: 201 });

  } catch (error: any) {
    // Captura erros de validação do Zod e retorna uma mensagem clara
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Dados de entrada inválidos.', errors: error.errors }, { status: 400 });
    }

    // Mantém o tratamento de erros de pino duplicado
    if (error.code === 'P2002') {
      return NextResponse.json({ message: `O pino já está configurado para este dispositivo.` }, { status: 409 });
    }

    console.error("Erro ao criar mapeamento de pino:", error);
    return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
  }
}
