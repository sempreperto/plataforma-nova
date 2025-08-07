// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

// Tipagem para o objeto global do Prisma
declare global {
  var prisma: PrismaClient | undefined;
}

// Esta abordagem previne a criação de múltiplas instâncias do PrismaClient
// durante o hot-reloading no ambiente de desenvolvimento. Em produção,
// uma única instância é criada.
export const prisma =
  global.prisma ||
  new PrismaClient({
    // Log de queries é útil para debug durante o desenvolvimento.
    // Pode ser ajustado para ['error', 'warn'] em produção.
    log: process.env.NODE_ENV === "development" ? ["query", "info", "warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
