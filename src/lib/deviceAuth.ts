// src/lib/deviceAuth.ts
import { NextApiRequest } from "next";

/**
 * Módulo de utilitários para autenticação de dispositivos.
 * Centraliza a lógica de verificação de tokens, tornando as API routes mais limpas e seguras.
 */

/**
 * Verifica se o token de autorização Bearer presente no header da requisição
 * corresponde ao token esperado do dispositivo.
 * * @param req - O objeto da requisição NextApiRequest.
 * @param expectedToken - O token OTA que se espera encontrar no header.
 * @returns `true` se a autorização for válida, `false` caso contrário.
 */
export async function verifyDeviceToken(req: NextApiRequest, expectedToken: string): Promise<boolean> {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.warn(`[AUTH] Acesso negado para token ${expectedToken}: Header de autorização ausente ou mal formatado.`);
        return false;
    }

    const tokenFromHeader = authHeader.split(' ')[1];

    if (tokenFromHeader !== expectedToken) {
        console.warn(`[AUTH] Acesso negado para token ${expectedToken}: Token do header não corresponde.`);
        return false;
    }

    return true;
}
