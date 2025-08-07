// src/pages/api/projetos/criar.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { createProject } from '@/lib/project.service'; // ✨ 1. IMPORTAMOS A NOVA FUNÇÃO

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Método ${req.method} não permitido`);
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    return res.status(401).json({ message: "Não autorizado." });
  }

  try {
    const { name } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ message: 'O nome do projeto é obrigatório.' });
    }

    // ✨ 2. USAMOS A FUNÇÃO DO SERVIÇO, PASSANDO OS DADOS NECESSÁRIOS
    const newProject = await createProject(name, session.user.id);
    return res.status(201).json(newProject);

  } catch (error) {
    return res.status(500).json({ message: 'Erro interno ao criar o projeto.' });
  }
}
