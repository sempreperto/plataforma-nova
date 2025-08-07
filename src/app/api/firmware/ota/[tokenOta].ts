// src/pages/api/firmware/ota/[tokenOta].ts
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { prisma } // ou o seu método para aceder à base de dados

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { tokenOta } = req.query;

        // 1. Validar o token e encontrar o dispositivo na base de dados
        const dispositivo = await prisma.dispositivo.findUnique({
            where: { tokenOta: String(tokenOta) },
        });

        if (!dispositivo || !dispositivo.targetFirmware) {
            return res.status(404).json({ error: 'Dispositivo ou firmware alvo não encontrado' });
        }

        // 2. Construir o caminho para o ficheiro .bin já compilado
        // (Você precisa de uma lógica para saber onde guardar os firmwares compilados)
        const firmwarePath = path.resolve(
            process.cwd(),
            'compiled_firmwares',
            dispositivo.targetFirmware, // Ex: "camera-v1.2.0.bin"
        );

        // 3. Verificar se o ficheiro existe
        if (!fs.existsSync(firmwarePath)) {
            console.error(`Firmware não encontrado em: ${firmwarePath}`);
            return res.status(404).json({ error: 'Ficheiro de firmware não encontrado no servidor' });
        }

        // 4. Enviar o ficheiro binário como resposta
        const stat = fs.statSync(firmwarePath);
        res.writeHead(200, {
            'Content-Type': 'application/octet-stream',
            'Content-Length': stat.size,
        });

        const readStream = fs.createReadStream(firmwarePath);
        readStream.pipe(res);

    } catch (error) {
        console.error('Erro no download OTA:', error);
        res.status(500).json({ error: 'Erro interno ao servir firmware' });
    }
}
