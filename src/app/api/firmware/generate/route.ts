// Ficheiro: src/app/api/firmware/generate/route.ts (VERSÃO ORIGINAL)
import { NextResponse } from 'next/server';
import { firmwareQueue } from '@/lib/queue';

export async function POST(request: Request) {
    try {
        const requestData = await request.json();
        const { modeloPlaca, tipoFirmware } = requestData;

        if (!modeloPlaca || !tipoFirmware) {
            return NextResponse.json(
                { error: 'Modelo e tipo de firmware são obrigatórios.' },
                { status: 400 }
            );
        }

        const job = await firmwareQueue.add('compile-firmware', requestData);

        return NextResponse.json({
            success: true,
            message: `Compilação agendada com sucesso! Job ID: ${job.id}`,
            jobId: job.id
        }, { status: 202 });

    } catch (error: any) {
        return NextResponse.json(
            { error: 'Erro ao agendar a compilação.', details: error.message },
            { status: 500 }
        );
    }
}
