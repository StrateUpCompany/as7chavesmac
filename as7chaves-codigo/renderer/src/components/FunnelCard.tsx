'use client';

import Link from 'next/link';

interface FunnelCardProps {
  funnel: {
    id: string;
    name: string;
    description: string;
    status: string;
    created_at: string;
  };
}

export default function FunnelCard({ funnel }: FunnelCardProps) {
  const statusLabel = 
    funnel.status === 'active' ? 'Ativo' : 
    funnel.status === 'draft' ? 'Rascunho' : 
    funnel.status;
  
  const statusClass = 
    funnel.status === 'active' ? 'bg-green-100 text-green-800' : 
    funnel.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 
    'bg-gray-100 text-gray-800';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{funnel.name}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{funnel.description}</p>
        <div className="flex justify-between items-center">
          <span className={`px-2 py-1 rounded-full text-xs ${statusClass}`}>
            {statusLabel}
          </span>
          <div className="space-x-2">
            <Link 
              href={`/funnels/${funnel.id}/edit`}
              className="text-blue-600 hover:text-blue-800"
            >
              Editar
            </Link>
            <Link 
              href={`/funnels/${funnel.id}`}
              className="text-blue-600 hover:text-blue-800"
            >
              Ver detalhes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
