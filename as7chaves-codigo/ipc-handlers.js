const { v4: uuidv4 } = require('uuid');

module.exports = function(ipcMain, db) {
  // Handlers para funis
  ipcMain.handle('get-funnels', async () => {
    try {
      const funnels = await db.all('SELECT * FROM funnels ORDER BY created_at DESC');
      return { success: true, data: funnels };
    } catch (error) {
      console.error('Erro ao buscar funis:', error);
      return { success: false, error: error.message };
    }
  });
  
  ipcMain.handle('get-funnel', async (event, id) => {
    try {
      const funnel = await db.get('SELECT * FROM funnels WHERE id = ?', id);
      if (!funnel) {
        return { success: false, error: 'Funil não encontrado' };
      }
      return { success: true, data: funnel };
    } catch (error) {
      console.error('Erro ao buscar funil:', error);
      return { success: false, error: error.message };
    }
  });
  
  ipcMain.handle('create-funnel', async (event, funnel) => {
    try {
      const id = uuidv4();
      await db.run(
        'INSERT INTO funnels (id, name, description, status) VALUES (?, ?, ?, ?)',
        [id, funnel.name, funnel.description, funnel.status || 'draft']
      );
      const newFunnel = await db.get('SELECT * FROM funnels WHERE id = ?', id);
      return { success: true, data: newFunnel };
    } catch (error) {
      console.error('Erro ao criar funil:', error);
      return { success: false, error: error.message };
    }
  });
  
  ipcMain.handle('update-funnel', async (event, id, funnel) => {
    try {
      await db.run(
        'UPDATE funnels SET name = ?, description = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [funnel.name, funnel.description, funnel.status, id]
      );
      const updatedFunnel = await db.get('SELECT * FROM funnels WHERE id = ?', id);
      return { success: true, data: updatedFunnel };
    } catch (error) {
      console.error('Erro ao atualizar funil:', error);
      return { success: false, error: error.message };
    }
  });
  
  ipcMain.handle('delete-funnel', async (event, id) => {
    try {
      await db.run('DELETE FROM funnels WHERE id = ?', id);
      return { success: true };
    } catch (error) {
      console.error('Erro ao excluir funil:', error);
      return { success: false, error: error.message };
    }
  });
  
  // Handlers para páginas
  ipcMain.handle('get-pages', async (event, funnelId) => {
    try {
      const pages = await db.all(
        'SELECT * FROM pages WHERE funnel_id = ? ORDER BY order_index ASC',
        funnelId
      );
      return { success: true, data: pages };
    } catch (error) {
      console.error('Erro ao buscar páginas:', error);
      return { success: false, error: error.message };
    }
  });
  
  ipcMain.handle('get-page', async (event, funnelId, pageId) => {
    try {
      const page = await db.get(
        'SELECT * FROM pages WHERE id = ? AND funnel_id = ?',
        [pageId, funnelId]
      );
      if (!page) {
        return { success: false, error: 'Página não encontrada' };
      }
      return { success: true, data: page };
    } catch (error) {
      console.error('Erro ao buscar página:', error);
      return { success: false, error: error.message };
    }
  });
  
  ipcMain.handle('create-page', async (event, funnelId, page) => {
    try {
      // Verificar se o funil existe
      const funnel = await db.get('SELECT id FROM funnels WHERE id = ?', funnelId);
      if (!funnel) {
        return { success: false, error: 'Funil não encontrado' };
      }
      
      // Obter o próximo índice de ordem
      const result = await db.get(
        'SELECT MAX(order_index) as max_order FROM pages WHERE funnel_id = ?',
        funnelId
      );
      const orderIndex = (result.max_order || 0) + 1;
      
      const id = uuidv4();
      await db.run(
        'INSERT INTO pages (id, funnel_id, name, type, content, order_index) VALUES (?, ?, ?, ?, ?, ?)',
        [id, funnelId, page.name, page.type, page.content || '{}', orderIndex]
      );
      
      const newPage = await db.get('SELECT * FROM pages WHERE id = ?', id);
      return { success: true, data: newPage };
    } catch (error) {
      console.error('Erro ao criar página:', error);
      return { success: false, error: error.message };
    }
  });
  
  ipcMain.handle('update-page', async (event, funnelId, pageId, page) => {
    try {
      await db.run(
        'UPDATE pages SET name = ?, type = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND funnel_id = ?',
        [page.name, page.type, page.content, pageId, funnelId]
      );
      
      const updatedPage = await db.get('SELECT * FROM pages WHERE id = ?', pageId);
      return { success: true, data: updatedPage };
    } catch (error) {
      console.error('Erro ao atualizar página:', error);
      return { success: false, error: error.message };
    }
  });
  
  ipcMain.handle('delete-page', async (event, funnelId, pageId) => {
    try {
      await db.run(
        'DELETE FROM pages WHERE id = ? AND funnel_id = ?',
        [pageId, funnelId]
      );
      return { success: true };
    } catch (error) {
      console.error('Erro ao excluir página:', error);
      return { success: false, error: error.message };
    }
  });
  
  // Handlers para leads
  ipcMain.handle('get-leads', async (event, funnelId) => {
    try {
      const leads = await db.all(
        'SELECT * FROM leads WHERE funnel_id = ? ORDER BY created_at DESC',
        funnelId
      );
      return { success: true, data: leads };
    } catch (error) {
      console.error('Erro ao buscar leads:', error);
      return { success: false, error: error.message };
    }
  });
  
  ipcMain.handle('create-lead', async (event, funnelId, lead) => {
    try {
      const id = uuidv4();
      await db.run(
        'INSERT INTO leads (id, funnel_id, page_id, email, name, phone, data) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [id, funnelId, lead.page_id, lead.email, lead.name, lead.phone, JSON.stringify(lead.data || {})]
      );
      
      const newLead = await db.get('SELECT * FROM leads WHERE id = ?', id);
      
      // Disparar webhooks registrados para este funil
      triggerWebhooks(funnelId, 'lead_created', newLead);
      
      return { success: true, data: newLead };
    } catch (error) {
      console.error('Erro ao criar lead:', error);
      return { success: false, error: error.message };
    }
  });
  
  // Handlers para estatísticas
  ipcMain.handle('get-stats', async (event, funnelId) => {
    try {
      // Total de leads
      const leadsResult = await db.get(
        'SELECT COUNT(*) as total FROM leads WHERE funnel_id = ?',
        funnelId
      );
      
      // Leads por página
      const leadsByPage = await db.all(
        `SELECT p.name as page_name, COUNT(l.id) as lead_count 
         FROM pages p 
         LEFT JOIN leads l ON p.id = l.page_id AND l.funnel_id = p.funnel_id
         WHERE p.funnel_id = ?
         GROUP BY p.id`,
        funnelId
      );
      
      // Leads por dia (últimos 30 dias)
      const leadsByDay = await db.all(
        `SELECT date(created_at) as date, COUNT(*) as count 
         FROM leads 
         WHERE funnel_id = ? AND created_at >= date('now', '-30 days')
         GROUP BY date(created_at)
         ORDER BY date`,
        funnelId
      );
      
      return { 
        success: true, 
        data: {
          totalLeads: leadsResult.total,
          leadsByPage,
          leadsByDay
        }
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      return { success: false, error: error.message };
    }
  });
  
  // Handlers para webhooks
  ipcMain.handle('register-webhook', async (event, config) => {
    try {
      // Criar tabela de webhooks se não existir
      await db.exec(`
        CREATE TABLE IF NOT EXISTS webhooks (
          id TEXT PRIMARY KEY,
          funnel_id TEXT,
          event_type TEXT NOT NULL,
          url TEXT NOT NULL,
          headers TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (funnel_id) REFERENCES funnels (id) ON DELETE CASCADE
        );
      `);
      
      const id = uuidv4();
      await db.run(
        'INSERT INTO webhooks (id, funnel_id, event_type, url, headers) VALUES (?, ?, ?, ?, ?)',
        [id, config.funnel_id, config.event_type, config.url, JSON.stringify(config.headers || {})]
      );
      
      const webhook = await db.get('SELECT * FROM webhooks WHERE id = ?', id);
      return { success: true, data: webhook };
    } catch (error) {
      console.error('Erro ao registrar webhook:', error);
      return { success: false, error: error.message };
    }
  });
  
  ipcMain.handle('list-webhooks', async (event) => {
    try {
      // Criar tabela de webhooks se não existir
      await db.exec(`
        CREATE TABLE IF NOT EXISTS webhooks (
          id TEXT PRIMARY KEY,
          funnel_id TEXT,
          event_type TEXT NOT NULL,
          url TEXT NOT NULL,
          headers TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (funnel_id) REFERENCES funnels (id) ON DELETE CASCADE
        );
      `);
      
      const webhooks = await db.all('SELECT * FROM webhooks');
      return { success: true, data: webhooks };
    } catch (error) {
      console.error('Erro ao listar webhooks:', error);
      return { success: false, error: error.message };
    }
  });
  
  ipcMain.handle('delete-webhook', async (event, id) => {
    try {
      await db.run('DELETE FROM webhooks WHERE id = ?', id);
      return { success: true };
    } catch (error) {
      console.error('Erro ao excluir webhook:', error);
      return { success: false, error: error.message };
    }
  });
  
  ipcMain.handle('test-webhook', async (event, id) => {
    try {
      const webhook = await db.get('SELECT * FROM webhooks WHERE id = ?', id);
      if (!webhook) {
        return { success: false, error: 'Webhook não encontrado' };
      }
      
      const testData = {
        event: webhook.event_type,
        test: true,
        timestamp: new Date().toISOString()
      };
      
      const result = await triggerWebhook(webhook, testData);
      return { success: true, data: result };
    } catch (error) {
      console.error('Erro ao testar webhook:', error);
      return { success: false, error: error.message };
    }
  });
  
  // Handlers para sistema
  ipcMain.handle('export-data', async () => {
    try {
      const funnels = await db.all('SELECT * FROM funnels');
      const pages = await db.all('SELECT * FROM pages');
      const leads = await db.all('SELECT * FROM leads');
      const webhooks = await db.all('SELECT * FROM webhooks');
      
      const exportData = {
        funnels,
        pages,
        leads,
        webhooks,
        exportDate: new Date().toISOString(),
        version: '1.0.0'
      };
      
      return { success: true, data: exportData };
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      return { success: false, error: error.message };
    }
  });
  
  ipcMain.handle('import-data', async (event, data) => {
    try {
      // Validar dados
      if (!data.funnels || !data.pages || !data.leads) {
        return { success: false, error: 'Formato de dados inválido' };
      }
      
      // Iniciar transação
      await db.run('BEGIN TRANSACTION');
      
      // Limpar dados existentes
      await db.run('DELETE FROM leads');
      await db.run('DELETE FROM pages');
      await db.run('DELETE FROM funnels');
      await db.run('DELETE FROM webhooks');
      
      // Importar funis
      for (const funnel of data.funnels) {
        await db.run(
          'INSERT INTO funnels (id, name, description, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
          [funnel.id, funnel.name, funnel.description, funnel.status, funnel.created_at, funnel.updated_at]
        );
      }
      
      // Importar páginas
      for (const page of data.pages) {
        await db.run(
          'INSERT INTO pages (id, funnel_id, name, type, content, order_index, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [page.id, page.funnel_id, page.name, page.type, page.content, page.order_index, page.created_at, page.updated_at]
        );
      }
      
      // Importar leads
      for (const lead of data.leads) {
        await db.run(
          'INSERT INTO leads (id, funnel_id, page_id, email, name, phone, data, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [lead.id, lead.funnel_id, lead.page_id, lead.email, lead.name, lead.phone, lead.data, lead.created_at]
        );
      }
      
      // Importar webhooks
      if (data.webhooks) {
        // Criar tabela de webhooks se não existir
        await db.exec(`
          CREATE TABLE IF NOT EXISTS webhooks (
            id TEXT PRIMARY KEY,
            funnel_id TEXT,
            event_type TEXT NOT NULL,
            url TEXT NOT NULL,
            headers TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (funnel_id) REFERENCES funnels (id) ON DELETE CASCADE
          );
        `);
        
        for (const webhook of data.webhooks) {
          await db.run(
            'INSERT INTO webhooks (id, funnel_id, event_type, url, headers, created_at) VALUES (?, ?, ?, ?, ?, ?)',
            [webhook.id, webhook.funnel_id, webhook.event_type, webhook.url, webhook.headers, webhook.created_at]
          );
        }
      }
      
      // Finalizar transação
      await db.run('COMMIT');
      
      return { success: true };
    } catch (error) {
      // Reverter transação em caso de erro
      await db.run('ROLLBACK');
      console.error('Erro ao importar dados:', error);
      return { success: false, error: error.message };
    }
  });
  
  // Função para disparar webhooks
  async function triggerWebhooks(funnelId, eventType, data) {
    try {
      // Verificar se a tabela de webhooks existe
      const tableExists = await db.get(`
        SELECT name FROM sqlite_master 
        WHERE type='table' AND name='webhooks'
      `);
      
      if (!tableExists) return;
      
      // Buscar webhooks registrados para este funil e evento
      const webhooks = await db.all(
        'SELECT * FROM webhooks WHERE (funnel_id = ? OR funnel_id IS NULL) AND event_type = ?',
        [funnelId, eventType]
      );
      
      // Disparar cada webhook
      for (const webhook of webhooks) {
        triggerWebhook(webhook, data);
      }
    } catch (error) {
      console.error('Erro ao disparar webhooks:', error);
    }
  }
  
  // Função para disparar um webhook específico
  async function triggerWebhook(webhook, data) {
    try {
      const headers = JSON.parse(webhook.headers || '{}');
      
      // Usar fetch para enviar a requisição
      const response = await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify(data)
      });
      
      return {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      };
    } catch (error) {
      console.error('Erro ao disparar webhook:', error);
      return {
        error: error.message,
        ok: false
      };
    }
  }
};
