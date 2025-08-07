// src/pages/api/dispositivos/[tokenOta]/audio-log.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { verifyDeviceToken } from '@/lib/deviceAuth';
import fs from 'fs';
import path from 'path';

// Desabilitar o bodyParser padrão do Next.js para receber o stream de dados do áudio
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método não permitido.' });
    }

    const { tokenOta } = req.query;
    if (typeof tokenOta !== 'string') {
        return res.status(400).json({ message: 'Token OTA inválido.' });
    }

    if (!await verifyDeviceToken(req, tokenOta)) {
        return res.status(403).json({ message: 'Acesso negado.' });
    }

    try {
        const uploadDir = path.join(process.cwd(), 'public', 'audio');
        // Garante que o diretório de uploads exista
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const fileName = `rec_${tokenOta}_${Date.now()}.wav`;
        const filePath = path.join(uploadDir, fileName);

        const fileStream = fs.createWriteStream(filePath);

        await new Promise((resolve, reject) => {
            req.pipe(fileStream);
            req.on('end', resolve);
            req.on('error', reject);
        });

        console.log(`[AUDIO API] Ficheiro de áudio salvo com sucesso em: ${filePath}`);

        // Salva o caminho do áudio no banco de dados na tabela AudioLog
        await prisma.audioLog.create({
            data: {
                filePath: `/audio/${fileName}`, // Salva o caminho público
                dispositivo: { connect: { tokenOta: tokenOta } }
            }
        });

        return res.status(200).json({ message: "Gravação recebida com sucesso.", path: `/audio/${fileName}` });
    } catch (error) {
        console.error(`[AUDIO API] Erro ao processar gravação para ${tokenOta}:`, error);
        return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
}
