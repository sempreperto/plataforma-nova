// src/pages/api/dispositivos/[tokenOta]/firmware.ts
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
// Importe o seu cliente Prisma ou método de acesso à base de dados
// import { prisma } from '../../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { tokenOta } = req.query;

        if (!tokenOta) {
            return res.status(400).json({ error: 'Token do dispositivo não fornecido.' });
        }

        console.log(`[OTA] Recebido pedido de firmware para o token: ${tokenOta}`);

        // 1. Encontre o dispositivo e o firmware alvo na sua base de dados
        //    (Este é um exemplo, ajuste para a sua lógica)
        // const dispositivo = await prisma.dispositivo.findUnique({
        //     where: { tokenOta: String(tokenOta) },
        // });
        //
        // if (!dispositivo || !dispositivo.targetFirmware) {
        //     return res.status(404).json({ error: 'Dispositivo ou firmware alvo não definido.' });
        // }
        // const nomeDoFicheiro = dispositivo.targetFirmware; // Ex: "camera-v1.1.bin"

        // --- PARA TESTE INICIAL ---
        // Para começar, vamos usar um nome de ficheiro fixo para garantir que o download funciona.
        const nomeDoFicheiro = "firmware.bin"; // Mude para o nome do seu binário de teste
        console.log(`[OTA] A servir o ficheiro de firmware de teste: ${nomeDoFicheiro}`);
        // -------------------------


        // 2. Construa o caminho para o ficheiro .bin já compilado
        //    Crie uma pasta na raiz do seu projeto chamada "compiled_firmwares" para guardar os binários
        const firmwarePath = path.resolve(process.cwd(), 'compiled_firmwares', nomeDoFicheiro);

        if (!fs.existsSync(firmwarePath)) {
            console.error(`[OTA] ERRO: Ficheiro de firmware não encontrado em: ${firmwarePath}`);
            return res.status(404).json({ error: 'Ficheiro de firmware não encontrado no servidor.' });
        }

        // 3. Envie o ficheiro binário como resposta ao dispositivo
        const stat = fs.statSync(firmwarePath);

        res.writeHead(200, {
            'Content-Type': 'application/octet-stream',
            'Content-Length': stat.size,
            'x-firmware-version': '1.1.0-test' // Cabeçalho opcional para versionamento
        });

        const readStream = fs.createReadStream(firmwarePath);
        readStream.pipe(res);

        console.log(`[OTA] Firmware ${nomeDoFicheiro} enviado com sucesso para ${tokenOta}.`);

    } catch (error: any) {
        console.error('[OTA] Erro crítico ao servir firmware:', error);
        res.status(500).json({ error: 'Erro interno do servidor ao servir o firmware.', details: error.message });
    }
}
