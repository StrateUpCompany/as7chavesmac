'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { apiClient } from '@/lib/apiClient';
import Link from 'next/link';

interface Page {
  id: string;
  name: string;
  type: string;
  order_index: number;
}

export default function FunnelDetailPage() {
  const router = useRouter();
  const params = useParams();
  const funnelId = params.id as string;
  
  const [funnel, setFunnel] = useState<any>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFunnelData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Carregar dados do funil
        const funnelResponse = await apiClient.getFunnel(funnelId);
        if (!funnelResponse.success) {
          setError(funnelResponse.error || 'Erro ao carregar funil');
          return;
        }
        
        setFunnel(funnelResponse.data);
        
        // Carregar páginas do funil
        const pagesResponse = await apiClient.getPages(funnelId);
        if (pagesResponse.success) {
          setPages(pagesResponse.data || []);
        }
        
        // Carregar estatísticas
        const statsResponse = await apiClient.getStats(funnelId);
        if (statsResponse.success) {
          setStats(statsResponse.data);
        }
      } catch (err) {
        setError('Erro ao conectar com o servidor');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadFunnelData();
  }, [funnelId]);

  const handleDeleteFunnel = async () => {
    if (!window.confirm('Tem certeza que deseja excluir este funil?')) {
      return;
    }
    
    try {
      setLoading(true);
      const response = await apiClient.deleteFunnel(funnelId);
      
      if (response.success) {
        router.push('/');
      } else {
        setError(response.error || 'Erro ao excluir funil');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !funnel) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error || 'Funil não encontrado'}</p>
        </div>
        <div className="mt-4">
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            Voltar para a página inicial
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{funnel.name}</h1>
        <div className="space-x-2">
          <Link 
            href={`/funnels/${funnelId}/edit`}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Editar Funil
          </Link>
          <button
            onClick={handleDeleteFunnel}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Excluir
          </button>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="mb-4">
          <span className={`px-2 py-1 rounded-full text-xs ${
            funnel.status === 'active' ? 'bg-green-100 text-green-800' : 
            funnel.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 
            'bg-gray-100 text-gray-800'
          }`}>
            {funnel.status === 'active' ? 'Ativo' : 
             funnel.status === 'draft' ? 'Rascunho' : 
             funnel.status}
          </span>
        </div>
        
        <p className="text-gray-700 mb-4">{funnel.description}</p>
        
        <div className="text-sm text-gray-500">
          Criado em: {new Date(funnel.created_at).toLocaleDateString()}
        </div>
      </div>
      
      {/* Estatísticas */}
      {stats && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Estatísticas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-blue-600">Total de Leads</div>
              <div className="text-2xl font-bold">{stats.totalLeads || 0}</div>
            </div>
            {/* Adicionar mais estatísticas conforme necessário */}
          </div>
        </div>
      )}
      
      {/* Páginas do Funil */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Páginas do Funil</h2>
          <Link 
            href={`/funnels/${funnelId}/pages/new`}
            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          >
            Nova Página
          </Link>
        </div>
        
        {pages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Este funil ainda não possui páginas</p>
            <Link 
              href={`/funnels/${funnelId}/pages/new`}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Criar Primeira Página
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {pages.map((page) => (
              <div 
                key={page.id} 
                className="flex justify-between items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50"
              >
                <div>
                  <div className="font-medium">{page.name}</div>
                  <div className="text-sm text-gray-500">Tipo: {page.type}</div>
                </div>
                <div className="space-x-2">
                  <Link 
                    href={`/funnels/${funnelId}/pages/${page.id}/edit`}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Editar
                  </Link>
                  <Link 
                    href={`/funnels/${funnelId}/pages/${page.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Ver
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
