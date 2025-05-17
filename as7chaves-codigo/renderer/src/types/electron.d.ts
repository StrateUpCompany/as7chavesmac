// src/types/electron.d.ts
interface ElectronAPI {
  // Funis
  getFunnels: () => Promise<any>;
  getFunnel: (id: string) => Promise<any>;
  createFunnel: (funnel: any) => Promise<any>;
  updateFunnel: (id: string, funnel: any) => Promise<any>;
  deleteFunnel: (id: string) => Promise<any>;
  
  // Páginas
  getPages: (funnelId: string) => Promise<any>;
  getPage: (funnelId: string, pageId: string) => Promise<any>;
  createPage: (funnelId: string, page: any) => Promise<any>;
  updatePage: (funnelId: string, pageId: string, page: any) => Promise<any>;
  deletePage: (funnelId: string, pageId: string) => Promise<any>;
  
  // Leads
  getLeads: (funnelId: string) => Promise<any>;
  createLead: (funnelId: string, lead: any) => Promise<any>;
  
  // Estatísticas
  getStats: (funnelId: string) => Promise<any>;
  
  // Webhooks
  registerWebhook: (config: any) => Promise<any>;
  listWebhooks: () => Promise<any>;
  deleteWebhook: (id: string) => Promise<any>;
  testWebhook: (id: string) => Promise<any>;
  
  // Sistema
  getAppVersion: () => Promise<any>;
  exportData: () => Promise<any>;
  importData: (data: any) => Promise<any>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export {};
