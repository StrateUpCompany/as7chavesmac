// Configuração do banco de dados SQLite para o sistema As 7 Chaves
const path = require('path');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const { app } = require('electron');

class Database {
  constructor() {
    this.db = null;
    this.dbPath = path.join(app.getPath('userData'), 'database.sqlite');
  }

  async initialize() {
    try {
      console.log(`Inicializando banco de dados em: ${this.dbPath}`);
      
      this.db = await open({
        filename: this.dbPath,
        driver: sqlite3.Database
      });
      
      // Habilitar chaves estrangeiras
      await this.db.run('PRAGMA foreign_keys = ON');
      
      // Criar tabelas
      await this.createTables();
      
      console.log('Banco de dados inicializado com sucesso');
      return this.db;
    } catch (error) {
      console.error('Erro ao inicializar banco de dados:', error);
      throw error;
    }
  }

  async createTables() {
    // Tabela de funis
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS funnels (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'draft',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Tabela de páginas
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS pages (
        id TEXT PRIMARY KEY,
        funnel_id TEXT NOT NULL,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        content TEXT,
        order_index INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (funnel_id) REFERENCES funnels (id) ON DELETE CASCADE
      );
    `);

    // Tabela de leads
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS leads (
        id TEXT PRIMARY KEY,
        funnel_id TEXT NOT NULL,
        page_id TEXT,
        email TEXT NOT NULL,
        name TEXT,
        phone TEXT,
        data TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (funnel_id) REFERENCES funnels (id) ON DELETE CASCADE,
        FOREIGN KEY (page_id) REFERENCES pages (id) ON DELETE SET NULL
      );
    `);

    // Tabela de webhooks
    await this.db.exec(`
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

    // Tabela de configurações
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Índices para melhorar performance
    await this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_pages_funnel_id ON pages(funnel_id);
      CREATE INDEX IF NOT EXISTS idx_leads_funnel_id ON leads(funnel_id);
      CREATE INDEX IF NOT EXISTS idx_leads_page_id ON leads(page_id);
      CREATE INDEX IF NOT EXISTS idx_webhooks_funnel_id ON webhooks(funnel_id);
      CREATE INDEX IF NOT EXISTS idx_webhooks_event_type ON webhooks(event_type);
    `);
  }

  async backup(backupPath) {
    try {
      // Criar backup do banco de dados
      const backupDb = new sqlite3.Database(backupPath);
      
      return new Promise((resolve, reject) => {
        this.db.backup(backupDb)
          .then(() => {
            backupDb.close();
            resolve({ success: true, path: backupPath });
          })
          .catch(err => {
            backupDb.close();
            reject(err);
          });
      });
    } catch (error) {
      console.error('Erro ao fazer backup do banco de dados:', error);
      throw error;
    }
  }

  async restore(backupPath) {
    try {
      // Fechar conexão atual
      await this.db.close();
      
      // Copiar arquivo de backup para o local do banco de dados
      const fs = require('fs');
      fs.copyFileSync(backupPath, this.dbPath);
      
      // Reabrir conexão
      this.db = await open({
        filename: this.dbPath,
        driver: sqlite3.Database
      });
      
      // Habilitar chaves estrangeiras
      await this.db.run('PRAGMA foreign_keys = ON');
      
      return { success: true };
    } catch (error) {
      console.error('Erro ao restaurar banco de dados:', error);
      throw error;
    }
  }

  async getSetting(key) {
    try {
      const result = await this.db.get(
        'SELECT value FROM settings WHERE key = ?',
        key
      );
      return result ? result.value : null;
    } catch (error) {
      console.error(`Erro ao buscar configuração ${key}:`, error);
      return null;
    }
  }

  async setSetting(key, value) {
    try {
      await this.db.run(
        `INSERT INTO settings (key, value, updated_at) 
         VALUES (?, ?, CURRENT_TIMESTAMP)
         ON CONFLICT(key) DO UPDATE SET 
         value = excluded.value,
         updated_at = CURRENT_TIMESTAMP`,
        [key, value]
      );
      return { success: true };
    } catch (error) {
      console.error(`Erro ao definir configuração ${key}:`, error);
      return { success: false, error: error.message };
    }
  }

  async close() {
    if (this.db) {
      await this.db.close();
      this.db = null;
    }
  }
}

module.exports = Database;
