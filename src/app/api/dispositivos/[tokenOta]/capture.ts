// src/pages/api/dispositivos/[tokenOta]/capture.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { verifyDeviceToken } from '@/lib/deviceAuth';
import fs from 'fs';
import path from 'path';

// ✨ PASSO 1: CONFIGURAÇÃO PARA ACEITAR FICHEIROS MAIORES ✨
// Esta configuração diz ao Next.js para não analisar o corpo da requisição como JSON
// e aumenta o limite de tamanho para 4MB, o que é mais do que suficiente para as fotos.
export const config = {
  api: {
    bodyParser: false,
  },
};

// Função para ler os dados brutos (buffer) da requisição
function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        stream.on('data', (chunk) => chunks.push(chunk as Buffer));
        stream.on('error', reject);
        stream.on('end', () => resolve(Buffer.concat(chunks)));
    });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método não permitido.' });
    }

    const { tokenOta } = req.query;
    if (typeof tokenOta !== 'string') {
        return res.status(400).json({ message: 'Token OTA inválido.' });
    }

    // A verificação de segurança continua a mesma
    if (!await verifyDeviceToken(req, tokenOta)) {
        return res.status(403).json({ message: 'Acesso negado.' });
    }

    try {
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        // Garante que o diretório de uploads exista
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const fileName = `capture_${tokenOta}_${Date.now()}.jpg`;
        const filePath = path.join(uploadDir, fileName);

        // ✨ PASSO 2: LER OS DADOS DA IMAGEM E SALVAR NO FICHEIRO ✨
        const buffer = await streamToBuffer(req);
        fs.writeFileSync(filePath, buffer);

        console.log(`[CAPTURE API] Imagem salva com sucesso em: ${filePath}`);

        // Salva o caminho da imagem no banco de dados
        await prisma.imageCapture.create({
            data: {
                filePath: `/uploads/${fileName}`, // Salva o caminho público
                dispositivo: { connect: { tokenOta: tokenOta } }
            }
        });

        // Limpa o último comando para evitar que a foto seja tirada novamente
        await prisma.dispositivo.update({
            where: { tokenOta: tokenOta },
            data: { lastCommand: null }
        });

        return res.status(200).json({ message: "Captura recebida com sucesso.", path: `/uploads/${fileName}` });
    } catch (error) {
        console.error(`[CAPTURE API] Erro ao processar captura para ${tokenOta}:`, error);
        return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
}
