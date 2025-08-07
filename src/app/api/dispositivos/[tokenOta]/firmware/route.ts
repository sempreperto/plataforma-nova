// Ficheiro: src/app/api/dispositivos/[tokenOta]/firmware/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: { tokenOta: string } }
) {
  const { tokenOta } = params;

  try {
    // 1. Busca o dispositivo no DB para saber qual firmware e modelo ele usa
    const dispositivo = await prisma.dispositivo.findUnique({
      where: { tokenOta: String(tokenOta) },
    });

    if (!dispositivo || !dispositivo.targetFirmware || !dispositivo.modelo) {
      return NextResponse.json({ error: 'Dispositivo, firmware alvo ou modelo não definido.' }, { status: 404 });
    }

    // Extrai o tipo de firmware do nome do arquivo (ex: "camera.bin" -> "camera")
    const feature = dispositivo.targetFirmware.replace('.bin', '');

    // 2. Constrói o caminho completo para o arquivo .bin
    const firmwarePath = path.resolve(
      process.cwd(),
      'compiled_firmwares',
      dispositivo.modelo, // ex: "seeed_xiao_esp32s3"
      feature,           // ex: "camera"
      'firmware.bin'     // O nome do arquivo é sempre este
    );

    if (!fs.existsSync(firmwarePath)) {
      console.error(`[OTA Download] Arquivo não encontrado: ${firmwarePath}`);
      return NextResponse.json({ error: 'Arquivo de firmware compilado não encontrado no servidor.' }, { status: 404 });
    }

    // 3. Lê o arquivo e o envia como resposta para o dispositivo
    const fileBuffer = fs.readFileSync(firmwarePath);
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Length': fileBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('[OTA Download] Erro crítico ao servir firmware:', error);
    return NextResponse.json({ error: 'Erro interno ao servir o firmware' }, { status: 500 });
  }
}
