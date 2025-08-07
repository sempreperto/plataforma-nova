// NOVO ARQUIVO: src/app/api/hello/route.ts

import { NextResponse } from 'next/server';

// Como a rota só responde a GET, exportamos uma função GET.
export async function GET(request: Request) {
  // Usamos NextResponse.json() para enviar a resposta.
  return NextResponse.json({
    status: "API online",
    timestamp: new Date().toISOString()
  });
}
