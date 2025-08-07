import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null // Evita que o BullMQ desista em caso de falha de conexão
});

// 1. A FILA: Onde a sua API vai adicionar as tarefas
export const firmwareQueue = new Queue('firmware-compilation', { connection });

// 2. O WORKER: Onde a lógica de compilação vai viver
// (A lógica será adicionada no Passo 3)
export const createFirmwareWorker = (processor: (job: any) => Promise<any>) => {
  return new Worker('firmware-compilation', processor, { connection });
};
