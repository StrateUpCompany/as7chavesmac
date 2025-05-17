'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/apiClient';
import Link from 'next/link';

interface Funnel {
  id: string;
  name: string;
  description: string;
  status: string;
  created_at: string;
}

export default function Home() {
  const [funnels, setFunnels] = useState<Funnel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isElectron, setIsElectron] = useState(false);

  useEffect(() => {
    // Verificar se estamos no ambiente Electron
    setIsElectron(typeof window !== 'undefined' && !!window.electronAPI);
    
    const loadFunnels = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getFunnels();
        if (response.success) {
          setFunnels(response.data || []);
        } else {
          setError(response.error || 'Erro ao carregar funis');
        }
      } catch (err) {
        setError('Erro ao conectar com o servidor');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadFunnels();
  }, []);

  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">As 7 Chaves</h1>
        <div className="text-sm text-gray-500">
          {isElectron ? 'Aplicativo Desktop' : 'Versão Web'}
        </div>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Meus Funis</h2>
        <Link 
          href="/funnels/new" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Novo Funil
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      ) : funnels.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <h3 className="text-xl font-medium mb-2">Nenhum funil encontrado</h3>
          <p className="text-gray-600 mb-6">Crie seu primeiro funil para começar a capturar leads</p>
          <Link 
            href="/funnels/new" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md"
          >
            Criar Primeiro Funil
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {funnels.map((funnel) => (
            <div key={funnel.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{funnel.name}</h3>
                <p className="text-gray-600 mb-4">{funnel.description}</p>
                <div className="flex justify-between items-center">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    funnel.status === 'active' ? 'bg-green-100 text-green-800' : 
                    funnel.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {funnel.status === 'active' ? 'Ativo' : 
                     funnel.status === 'draft' ? 'Rascunho' : 
                     funnel.status}
                  </span>
                  <Link 
                    href={`/funnels/${funnel.id}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Ver detalhes
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
