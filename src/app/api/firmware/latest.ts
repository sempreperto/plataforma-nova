// src/pages/api/firmware/latest.ts
import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import fs from 'fs';

// Esta API serve um firmware genérico e público.
// Não requer autenticação, pois é destinada a dispositivos "novos" ou
// que perderam sua configuração específica.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: 'Método não permitido.' });
  }

  // Nome do arquivo de firmware base/genérico
  const firmwareFileName = 'firmware_base.bin';
  const firmwarePath = path.join(process.cwd(), 'firmwares', firmwareFileName);

  if (!fs.existsSync(firmwarePath)) {
    console.error(`[FIRMWARE API] Arquivo de firmware base não encontrado: ${firmwarePath}`);
    return res.status(404).json({ message: 'Firmware base não encontrado no servidor.' });
  }

  try {
    const stat = fs.statSync(firmwarePath);
    const fileSize = stat.size;

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${firmwareFileName}"`);
    res.setHeader('Content-Length', fileSize.toString());

    const fileStream = fs.createReadStream(firmwarePath);
    fileStream.pipe(res);

  } catch (error) {
    console.error('Erro ao servir o firmware base:', error);
    return res.status(500).json({ message: 'Erro interno do servidor ao servir o firmware.' });
  }
}
