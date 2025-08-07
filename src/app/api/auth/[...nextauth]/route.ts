// Ficheiro: src/app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";

const handler = NextAuth(authOptions);

// Esta é a sintaxe correta para o App Router.
// Ela exporta a mesma lógica do NextAuth para os métodos GET e POST
// usando "named exports".
export { handler as GET, handler as POST };
