// Ficheiro: src/pages/api/socketio.ts (NOVO FICHIERO E LOCALIZAÇÃO CORRETA)
import { Server as SocketIOServer } from "socket.io";
import { NextApiRequest, NextApiResponse } from "next";
import { initMqttClient } from "@/lib/mqttService";

// Extendemos o tipo NextApiResponse para incluir a propriedade do servidor de sockets
type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: any; // Usamos 'any' para evitar conflitos de tipo com o servidor http do Next.js
  };
};

export default function handler(req: NextApiRequest, res: NextApiResponseWithSocket) {
  // Se o servidor de IO já não estiver a funcionar, nós iniciamo-lo
  if (!res.socket.server.io) {
    console.log("🔌 Iniciando o servidor Socket.IO via Pages Router...");

    const io = new SocketIOServer(res.socket.server, {
      path: "/api/socket.io", // Usamos um caminho padrão para o Socket.IO
      addTrailingSlash: false,
      cors: { origin: "*", methods: ["GET", "POST"] },
    });

    res.socket.server.io = io;

    initMqttClient(io);

    io.on("connection", (socket) => {
      console.log(`⚡ Cliente conectado: ${socket.id}`);

      socket.on('joinProjectRoom', (projectId: string) => {
        socket.join(projectId);
        console.log(`💻 Cliente ${socket.id} entrou na sala do projeto: ${projectId}`);
      });

      socket.on("disconnect", () => {
        console.log(`🔥 Cliente desconectado: ${socket.id}`);
      });
    });
  }
  res.end(); // Finaliza a resposta da API
}
