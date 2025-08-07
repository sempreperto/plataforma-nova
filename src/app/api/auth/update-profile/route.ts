// NOVO ARQUIVO: src/app/api/auth/update-profile/route.ts

import { NextResponse } from 'next/server'; // 1. Trocamos NextApiResponse por NextResponse
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

// 2. Exportamos uma função assíncrona nomeada POST
export async function POST(request: Request) {
    // 3. A sessão é obtida de forma mais simples
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
    }

    try {
        // 4. O corpo da requisição é lido com await request.json()
        const { name, telefone } = await request.json();

        if (!name || !telefone) {
            return NextResponse.json({ message: 'Nome e telefone são obrigatórios.' }, { status: 400 });
        }

        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                name: name,
                telefone: telefone,
            },
        });

        // 5. A resposta de sucesso usa NextResponse.json()
        return NextResponse.json({ message: 'Perfil atualizado com sucesso.' }, { status: 200 });

    } catch (error) {
        console.error("Erro ao atualizar perfil:", error);
        return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
    }
}
