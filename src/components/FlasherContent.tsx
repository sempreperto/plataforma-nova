// Ficheiro: src/components/FlasherContent.tsx (VERSÃO FINAL)
"use client";

import { useEffect, useRef } from "react";

// Tipagem para os arquivos
interface FirmwareFiles {
  firmware: string;
  bootloader: string;
  partitions: string;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'esp-web-install-button': any; // Usamos 'any' para simplificar
    }
  }
}

export default function FlasherContent({ firmwareFiles, board }: { firmwareFiles: FirmwareFiles; board: string; }) {
  const buttonRef = useRef<HTMLElement>(null);

  useEffect(() => {
    import("esp-web-tools");

    const { bootloader, partitions, firmware } = firmwareFiles;

    // Converte os dados base64 para o formato que o ESP Web Tools precisa (Blob)
    const manifest = {
      name: `Soneh Provisioning (${board})`,
      builds: [{
        chipFamily: "ESP32-S3", // Você pode tornar isso dinâmico se tiver outras placas
        parts: [
          { path: new Blob([Buffer.from(bootloader, 'base64')]), offset: 0 },
          { path: new Blob([Buffer.from(partitions, 'base64')]), offset: 32768 },
          { path: new Blob([Buffer.from(firmware, 'base64')]), offset: 65536 },
        ]
      }]
    };

    if (buttonRef.current) {
      // Atribui o manifesto gerado dinamicamente ao botão
      buttonRef.current.manifest = manifest;
    }
  }, [firmwareFiles, board]);

  return (
    <div className="flex flex-col items-center justify-center">
      <p className="text-gray-400 text-center mb-6">
        Coloque a sua placa em **modo Bootloader** e clique em "Instalar".
      </p>
      {/* O componente agora usa uma ref para receber o manifesto dinamicamente */}
      <esp-web-install-button ref={buttonRef}>
        <button slot="activate">Instalar</button>
      </esp-web-install-button>
    </div>
  );
}
