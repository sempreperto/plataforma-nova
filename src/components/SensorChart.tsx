"use client";
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Reading {
  timestamp: string;
  value: number;
  unit: string;
}

export default function SensorChart({ tokenOta }: { tokenOta: string }) {
  const [data, setData] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/dispositivos/${tokenOta}/readings`);
        const readings: Reading[] = await res.json();
        setData(readings);
      } catch (error) {
        console.error("Falha ao buscar dados do sensor:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tokenOta]);

  if (loading) return <p className="text-gray-400">Carregando dados do sensor...</p>;
  if (data.length === 0) return <p className="text-gray-400">Nenhuma leitura de sensor registrada ainda.</p>;

  return (
    <div className="bg-gray-800/50 p-6 rounded-2xl mt-8 border border-gray-700">
        <h3 className="text-xl font-bold mb-4 text-purple-300">Histórico de Temperatura</h3>
        <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
            <XAxis
                dataKey="timestamp"
                stroke="#A0AEC0"
                tickFormatter={(time) => format(new Date(time), 'HH:mm', { locale: ptBR })}
            />
            <YAxis stroke="#A0AEC0" unit={` ${data[0].unit}`} />
            <Tooltip
                contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }}
                labelFormatter={(time) => format(new Date(time), 'dd/MM HH:mm', { locale: ptBR })}
            />
            <Legend />
            <Line type="monotone" dataKey="value" name="Temperatura" stroke="#8884d8" strokeWidth={2} />
        </LineChart>
        </ResponsiveContainer>
    </div>
  );
}
