// Ficheiro: src/types/next-auth.d.ts
import { Role } from '@prisma/client';
import 'next-auth';

declare module 'next-auth' {
  interface User {
    telefone?: string | null;
    role: Role;
  }

  interface Session {
    user: {
      id: string;
      telefone?: string | null;
      role: Role;
    } & DefaultSession['user'];
  }
}
