// components/WebFlasher.js

"use client"; // Necessário para componentes com interatividade no Next.js App Router

import React, { useEffect } from 'react';

const WebFlasher = () => {
  // A biblioteca esp-web-tools pode demorar um pouco para carregar e definir o componente.
  // Este useEffect ajuda a garantir que o componente personalizado seja renderizado corretamente.
  useEffect(() => {
    const importESPWabTools = async () => {
      await import("esp-web-tools");
    };
    importESPWabTools();
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h3>Instalação Rápida via Navegador</h3>
      <p>Conecte a sua placa, coloque-a em modo Bootloader e clique abaixo para instalar.</p>

      {/* Este é o componente da biblioteca esp-web-tools */}
      <esp-web-install-button manifest="/manifest.json">
      </esp-web-install-button>

      <p style={{ fontSize: '0.8em', color: '#666', marginTop: '15px' }}>
        Suportado por Google Chrome e Microsoft Edge.
      </p>
    </div>
  );
};

export default WebFlasher;
