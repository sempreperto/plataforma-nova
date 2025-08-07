// Ficheiro: src/app/api/firmware/provisioning/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { modeloPlaca } = await request.json();
    if (!modeloPlaca) {
      return NextResponse.json({ error: "O modelo da placa é obrigatório." }, { status: 400 });
    }

    // O firmware de provisionamento não muda com frequência,
    // então podemos buscar de uma pasta fixa onde o gerador o salva.
    const baseDir = path.resolve(process.cwd(), 'compiled_firmwares', modeloPlaca, 'provisioning');

    const firmwarePath = path.join(baseDir, 'firmware.bin');
    const bootloaderPath = path.join(baseDir, 'bootloader.bin');
    const partitionsPath = path.join(baseDir, 'partitions.bin');

    // Lê os três arquivos binários
    const [firmware, bootloader, partitions] = await Promise.all([
      fs.readFile(firmwarePath),
      fs.readFile(bootloaderPath),
      fs.readFile(partitionsPath),
    ]);

    // Retorna os arquivos em formato base64, prontos para o Web Flasher
    return NextResponse.json({
      success: true,
      firmware: firmware.toString('base64'),
      bootloader: bootloader.toString('base64'),
      partitions: partitions.toString('base64'),
    });

  } catch (error: any) {
    console.error("[API Provisioning] Erro ao buscar binários:", error);
    return NextResponse.json({ error: "Erro ao buscar arquivos de firmware.", details: error.message }, { status: 500 });
  }
}
