"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiCpu, FiLoader, FiUpload } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { FlashSession } from "web-flasher";
import { FlashingUI } from "web-flasher-ui";
import "web-flasher-ui/style.css";

interface FirmwareFlasherProps {
  modelo: string;
  tokenOta: string;
}

// ✅ Função movida para fora do useEffect e melhorada
function resolveManifestPath(modelo: string): string | null {
  const base = "/compiled_firmwares";
  const normalized = modelo.toLowerCase().replace(/[\s_]+/g, "-");

  if (normalized.includes("esp32-s3") || normalized.includes("xiao") || normalized.includes("seeed")) {
    return `${base}/seeed_xiao_esp32s3/provisioning/manifest.json`;
  }

  if (normalized.includes("esp32-wroom-32")) {
    return `${base}/esp32-wroom-32/provisioning/manifest.json`;
  }

  if (normalized.includes("esp32dev") || normalized === "esp32") {
    return `${base}/esp32dev/provisioning/manifest.json`;
  }

  return null; // modelo não suportado
}

export default function FirmwareFlasher({ modelo, tokenOta }: FirmwareFlasherProps) {
  const [manifestUrl, setManifestUrl] = useState<string | null>(null);
  const [loadingManifest, setLoadingManifest] = useState(false);
  const [manifestError, setManifestError] = useState(false);
  const [session, setSession] = useState<FlashSession | null>(null);

  useEffect(() => {
    const path = resolveManifestPath(modelo);
    if (!path) {
      setManifestError(true);
      toast.error("Modelo de placa não suportado.");
      return;
    }

    const url = path;
    setLoadingManifest(true);
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Manifesto não encontrado");
        return res.json();
      })
      .then(() => {
        setManifestUrl(url);
        setManifestError(false);
      })
      .catch(() => {
        setManifestError(true);
        toast.error("Erro ao carregar o manifesto do firmware.");
      })
      .finally(() => {
        setLoadingManifest(false);
      });
  }, [modelo]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-500 text-white">
          <FiUpload className="mr-2" />
          Instalar Firmware via USB
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 text-white border-gray-700 max-w-4xl h-[80vh] overflow-y-auto">
        <DialogTitle className="text-2xl mb-4">Instalação via USB</DialogTitle>

        {loadingManifest && (
          <div className="flex items-center gap-2 text-blue-400">
            <FiLoader className="animate-spin" /> Carregando firmware...
          </div>
        )}

        {manifestError && (
          <div className="text-red-400">
            Erro ao carregar o manifesto. Verifique se os arquivos estão no lugar correto.
          </div>
        )}

        {manifestUrl && (
          <FlashingUI
            manifest={manifestUrl}
            onSession={(s) => setSession(s)}
            className="bg-gray-800 rounded-lg p-4"
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
