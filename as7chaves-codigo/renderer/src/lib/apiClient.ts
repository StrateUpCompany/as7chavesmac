// src/lib/apiClient.ts
export const apiClient = {
  // Funis
  getFunnels: async () => {
    if (typeof window !== 'undefined' && window.electronAPI) {
      return window.electronAPI.getFunnels();
    }
    // Fallback para API HTTP (desenvolvimento web)
    const response = await fetch('/api/funnels');
    return response.json();
  },
  
  getFunnel: async (id: string) => {
    if (typeof window !== 'undefined' && window.electronAPI) {
      return window.electronAPI.getFunnel(id);
    }
    const response = await fetch(`/api/funnels/${id}`);
    return response.json();
  },
  
  createFunnel: async (funnel: any) => {
    if (typeof window !== 'undefined' && window.electronAPI) {
      return window.electronAPI.createFunnel(funnel);
    }
    const response = await fetch('/api/funnels', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(funnel),
    });
    return response.json();
  },
  
  updateFunnel: async (id: string, funnel: any) => {
    if (typeof window !== 'undefined' && window.electronAPI) {
      return window.electronAPI.updateFunnel(id, funnel);
    }
    const response = await fetch(`/api/funnels/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(funnel),
    });
    return response.json();
  },
  
  deleteFunnel: async (id: string) => {
    if (typeof window !== 'undefined' && window.electronAPI) {
      return window.electronAPI.deleteFunnel(id);
    }
    const response = await fetch(`/api/funnels/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },
  
  // Páginas
  getPages: async (funnelId: string) => {
    if (typeof window !== 'undefined' && window.electronAPI) {
      return window.electronAPI.getPages(funnelId);
    }
    const response = await fetch(`/api/funnels/${funnelId}/pages`);
    return response.json();
  },
  
  getPage: async (funnelId: string, pageId: string) => {
    if (typeof window !== 'undefined' && window.electronAPI) {
      return window.electronAPI.getPage(funnelId, pageId);
    }
    const response = await fetch(`/api/funnels/${funnelId}/pages/${pageId}`);
    return response.json();
  },
  
  createPage: async (funnelId: string, page: any) => {
    if (typeof window !== 'undefined' && window.electronAPI) {
      return window.electronAPI.createPage(funnelId, page);
    }
    const response = await fetch(`/api/funnels/${funnelId}/pages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(page),
    });
    return response.json();
  },
  
  updatePage: async (funnelId: string, pageId: string, page: any) => {
    if (typeof window !== 'undefined' && window.electronAPI) {
      return window.electronAPI.updatePage(funnelId, pageId, page);
    }
    const response = await fetch(`/api/funnels/${funnelId}/pages/${pageId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(page),
    });
    return response.json();
  },
  
  deletePage: async (funnelId: string, pageId: string) => {
    if (typeof window !== 'undefined' && window.electronAPI) {
      return window.electronAPI.deletePage(funnelId, pageId);
    }
    const response = await fetch(`/api/funnels/${funnelId}/pages/${pageId}`, {
      method: 'DELETE',
    });
    return response.json();
  },
  
  // Leads
  getLeads: async (funnelId: string) => {
    if (typeof window !== 'undefined' && window.electronAPI) {
      return window.electronAPI.getLeads(funnelId);
    }
    const response = await fetch(`/api/funnels/${funnelId}/leads`);
    return response.json();
  },
  
  createLead: async (funnelId: string, lead: any) => {
    if (typeof window !== 'undefined' && window.electronAPI) {
      return window.electronAPI.createLead(funnelId, lead);
    }
    const response = await fetch(`/api/funnels/${funnelId}/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(lead),
    });
    return response.json();
  },
  
  // Estatísticas
  getStats: async (funnelId: string) => {
    if (typeof window !== 'undefined' && window.electronAPI) {
      return window.electronAPI.getStats(funnelId);
    }
    const response = await fetch(`/api/funnels/${funnelId}/stats`);
    return response.json();
  },
  
  // Webhooks
  registerWebhook: async (config: any) => {
    if (typeof window !== 'undefined' && window.electronAPI) {
      return window.electronAPI.registerWebhook(config);
    }
    const response = await fetch('/api/webhooks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    });
    return response.json();
  },
  
  listWebhooks: async () => {
    if (typeof window !== 'undefined' && window.electronAPI) {
      return window.electronAPI.listWebhooks();
    }
    const response = await fetch('/api/webhooks');
    return response.json();
  },
  
  deleteWebhook: async (id: string) => {
    if (typeof window !== 'undefined' && window.electronAPI) {
      return window.electronAPI.deleteWebhook(id);
    }
    const response = await fetch(`/api/webhooks/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },
  
  testWebhook: async (id: string) => {
    if (typeof window !== 'undefined' && window.electronAPI) {
      return window.electronAPI.testWebhook(id);
    }
    const response = await fetch(`/api/webhooks/${id}/test`, {
      method: 'POST',
    });
    return response.json();
  },
  
  // Sistema
  getAppVersion: async () => {
    if (typeof window !== 'undefined' && window.electronAPI) {
      return window.electronAPI.getAppVersion();
    }
    return { version: 'web' };
  },
  
  exportData: async () => {
    if (typeof window !== 'undefined' && window.electronAPI) {
      return window.electronAPI.exportData();
    }
    const response = await fetch('/api/system/export');
    return response.json();
  },
  
  importData: async (data: any) => {
    if (typeof window !== 'undefined' && window.electronAPI) {
      return window.electronAPI.importData(data);
    }
    const response = await fetch('/api/system/import', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },
};
