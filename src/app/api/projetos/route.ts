// Ficheiro: src/app/api/projetos/route.ts (VERSÃO ORIGINAL)
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from '@/lib/prisma';

// Rota para buscar todos os projetos de um usuário
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const projects = await prisma.projeto.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        dispositivos: {
          select: {
            id: true,
            name: true,
            tokenOta: true,
            modelo: true,
            lastActivity: true,
          },
        },
      },
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Erro ao buscar projetos:", error);
    return NextResponse.json({ error: 'Erro ao buscar projetos' }, { status: 500 });
  }
}

// Rota para criar um novo projeto
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }

  try {
    const { name } = await request.json();
    if (!name) {
      return NextResponse.json({ message: "O nome do projeto é obrigatório." }, { status: 400 });
    }
    const newProject = await prisma.projeto.create({
      data: {
        name,
        userId: session.user.id,
      },
    });
    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Erro ao criar projeto." }, { status: 500 });
  }
}
