// src/lib/project.service.ts
import { prisma } from "./prisma";

/**
 * Busca todos os projetos que pertencem a um usuário específico.
 * @param userId - O ID do usuário.
 * @returns Uma lista de projetos.
 */
export async function findProjectsByUserId(userId: string) {
  console.log(`Buscando projetos para o usuário: ${userId}`);
  try {
    const projetos = await prisma.projeto.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' },
    });
    return projetos;
  } catch (error) {
    console.error("[ProjectService] Erro ao buscar projetos:", error);
    throw new Error("Não foi possível buscar os projetos no banco de dados.");
  }
}

// 👇👇👇 ADICIONE ESTA NOVA FUNÇÃO ABAIXO 👇👇👇

/**
 * Cria um novo projeto para um usuário.
 * @param name - O nome do novo projeto.
 * @param userId - O ID do usuário que está criando o projeto.
 * @returns O objeto do projeto recém-criado.
 */
export async function createProject(name: string, userId: string) {
  console.log(`Criando projeto '${name}' para o usuário: ${userId}`);
  try {
    const newProject = await prisma.projeto.create({
      data: {
        name: name,
        userId: userId,
      },
    });
    return newProject;
  } catch (error) {
    console.error("[ProjectService] Erro ao criar projeto:", error);
    throw new Error("Não foi possível criar o projeto no banco de dados.");
  }
}

// 👇👇👇 ADICIONE ESTA NOVA FUNÇÃO ABAIXO 👇👇👇

/**
 * Busca um projeto específico pelo seu ID, garantindo que ele pertence ao usuário.
 * @param projectId - O ID do projeto a ser buscado.
 * @param userId - O ID do usuário para verificação de propriedade.
 * @returns O objeto do projeto com seus dispositivos, ou null se não for encontrado.
 */
export async function findProjectById(projectId: string, userId: string) {
  console.log(`Buscando detalhes do projeto ${projectId} para o usuário ${userId}`);
  try {
    const projeto = await prisma.projeto.findFirst({
      where: {
        id: projectId,
        userId: userId, // Importante: garante que o usuário é o dono
      },
      include: {
        dispositivos: true, // Inclui a lista de dispositivos no resultado
      }
    });
    return projeto;
  } catch (error) {
    console.error(`[ProjectService] Erro ao buscar projeto ${projectId}:`, error);
    throw new Error("Não foi possível buscar os detalhes do projeto.");
  }
}
