// Ficheiro: src/hooks/useSocket.ts
"use client";
import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

let socket: Socket;

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Conecta ao servidor de socket na primeira renderização
    const socketInitializer = async () => {
      // Precisamos fazer uma chamada inicial para a nossa rota de API para "acordar" o servidor
      await fetch('/api/socket');
      socket = io();

      socket.on('connect', () => {
        console.log('✅ Conectado ao servidor Socket.IO!');
        setIsConnected(true);
      });

      socket.on('disconnect', () => {
        console.log('🔌 Desconectado do servidor Socket.IO.');
        setIsConnected(false);
      });
    };

    if (!socket) {
      socketInitializer();
    }

    // Limpa a conexão quando o componente é desmontado
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  return { socket, isConnected };
};
