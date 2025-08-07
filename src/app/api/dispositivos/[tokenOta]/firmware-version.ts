import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import fs from 'fs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Em produção, adicione a verificação de token de autorização aqui.

  // ✅ IMPORTANTE: O nome aqui deve ser EXATAMENTE o mesmo do arquivo .bin
  // que você compilou e colocou na pasta 'firmwares'.
  const firmwareFileName = 'SEU_FIRMWARE_AQUI.ino.bin';

  const firmwaresDir = path.join(process.cwd(), 'firmwares');
  const firmwareFilePath = path.join(firmwaresDir, firmwareFileName);

  if (!fs.existsSync(firmwareFilePath)) {
    return res.status(404).json({ message: 'Arquivo de firmware não encontrado no servidor.' });
  }

  res.setHeader('Content-Type', 'application/octet-stream');
  res.setHeader('Content-Disposition', `attachment; filename="${firmwareFileName}"`);
  const fileStream = fs.createReadStream(firmwareFilePath);
  fileStream.pipe(res);
}
