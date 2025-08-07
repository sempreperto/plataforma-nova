// src/app/dashboard/test-device/page.tsx

"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TestDevicePage() {
    const [data, setData] = useState(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Vamos usar um token OTA conhecido para o teste
    const tokenOtaParaTestar = "c0cfa0b4c2ca78ba";

    useEffect(() => {
        console.log("PÁGINA DE TESTE: A iniciar a busca de dados...");

        fetch(`/api/dispositivos/${tokenOtaParaTestar}`)
            .then(res => {
                if (!res.ok) {
                    return res.text().then(text => {
                        throw new Error(`Erro na API: Status ${res.status} - ${text}`);
                    });
                }
                return res.json();
            })
            .then(jsonData => {
                console.log("PÁGINA DE TESTE: Dados recebidos com sucesso!", jsonData);
                setData(jsonData);
            })
            .catch(err => {
                console.error("PÁGINA DE TESTE: Falha na busca!", err);
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []); // O array vazio [] garante que isto só executa uma vez

    return (
        <div style={{ padding: '2rem', color: 'white', fontFamily: 'monospace' }}>
            <Link href="/dashboard" style={{ color: 'lightblue' }}>Voltar ao Dashboard</Link>
            <h1 style={{ fontSize: '2rem', marginTop: '1rem' }}>Página de Teste de API</h1>
            <hr style={{ margin: '1rem 0' }} />

            {loading && <p>A carregar dados do teste...</p>}

            {error && (
                <div style={{ color: 'red' }}>
                    <h2>Ocorreu um Erro no Teste:</h2>
                    <p>{error}</p>
                </div>
            )}

            {data && (
                <div>
                    <h2>✅ Teste bem-sucedido! Dados recebidos:</h2>
                    <pre style={{ background: '#222', color: '#eee', padding: '1rem', borderRadius: '8px', marginTop: '1rem', whiteSpace: 'pre-wrap' }}>
                        {JSON.stringify(data, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
}
