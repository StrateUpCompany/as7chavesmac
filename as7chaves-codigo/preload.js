const { contextBridge, ipcRenderer } = require('electron');

// Expõe APIs seguras para o processo de renderização
contextBridge.exposeInMainWorld('electronAPI', {
  // Funis
  getFunnels: () => ipcRenderer.invoke('get-funnels'),
  getFunnel: (id) => ipcRenderer.invoke('get-funnel', id),
  createFunnel: (funnel) => ipcRenderer.invoke('create-funnel', funnel),
  updateFunnel: (id, funnel) => ipcRenderer.invoke('update-funnel', id, funnel),
  deleteFunnel: (id) => ipcRenderer.invoke('delete-funnel', id),
  
  // Páginas
  getPages: (funnelId) => ipcRenderer.invoke('get-pages', funnelId),
  getPage: (funnelId, pageId) => ipcRenderer.invoke('get-page', funnelId, pageId),
  createPage: (funnelId, page) => ipcRenderer.invoke('create-page', funnelId, page),
  updatePage: (funnelId, pageId, page) => ipcRenderer.invoke('update-page', funnelId, pageId, page),
  deletePage: (funnelId, pageId) => ipcRenderer.invoke('delete-page', funnelId, pageId),
  
  // Leads
  getLeads: (funnelId) => ipcRenderer.invoke('get-leads', funnelId),
  createLead: (funnelId, lead) => ipcRenderer.invoke('create-lead', funnelId, lead),
  
  // Estatísticas
  getStats: (funnelId) => ipcRenderer.invoke('get-stats', funnelId),
  
  // Webhooks
  registerWebhook: (config) => ipcRenderer.invoke('register-webhook', config),
  listWebhooks: () => ipcRenderer.invoke('list-webhooks'),
  deleteWebhook: (id) => ipcRenderer.invoke('delete-webhook', id),
  testWebhook: (id) => ipcRenderer.invoke('test-webhook', id),
  
  // Sistema
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  exportData: () => ipcRenderer.invoke('export-data'),
  importData: (data) => ipcRenderer.invoke('import-data', data)
});
