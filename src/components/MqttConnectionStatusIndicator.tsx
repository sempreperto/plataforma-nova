"use client";
import React, { useState, useEffect } from 'react';
import { FiWifi, FiWifiOff } from 'react-icons/fi';

export default function MqttConnectionStatusIndicator() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchMqttStatus = async () => {
      try {
        const response = await fetch('/api/mqtt/status');
        const data = await response.json();
        setIsConnected(data.connected);
      } catch (err) {
        setIsConnected(false);
      }
    };
    fetchMqttStatus();
    const intervalId = setInterval(fetchMqttStatus, 5000); // Atualiza a cada 5 segundos
    return () => clearInterval(intervalId);
  }, []);

  if (isConnected === null) {
    return <div className="text-sm text-gray-500">A verificar...</div>;
  }

  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${isConnected ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
      {isConnected ? <FiWifi /> : <FiWifiOff />}
      <span>{isConnected ? 'Servidor MQTT Conectado' : 'Servidor MQTT Offline'}</span>
    </div>
  );
}
