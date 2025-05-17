// Integração de todas as camadas do aplicativo Electron
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const Database = require('./database');
const { initBackend } = require('./backend');

// Variáveis globais
let mainWindow;
let db;

// Evitar múltiplas instâncias do aplicativo
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
  process.exit(0);
}

// Função para criar a janela principal
async function createWindow() {
  // Criar a janela do navegador
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#ffffff'
  });

  // Carregar o frontend Next.js
  if (process.env.NODE_ENV === 'development') {
    // Em desenvolvimento, carrega do servidor Next.js
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    // Em produção, carrega do build estático
    mainWindow.loadFile(path.join(__dirname, 'renderer/out/index.html'));
  }

  // Evento quando a janela é fechada
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Inicializar o aplicativo
async function initApp() {
  try {
    // Inicializar banco de dados
    const database = new Database();
    db = await database.initialize();
    
    // Inicializar backend
    await initBackend(ipcMain, db);
    
    // Configurar handlers IPC adicionais para sistema
    setupSystemHandlers();
    
    // Criar janela principal
    createWindow();
  } catch (error) {
    console.error('Erro ao inicializar aplicativo:', error);
    app.quit();
  }
}

// Configurar handlers IPC para sistema
function setupSystemHandlers() {
  // Versão do aplicativo
  ipcMain.handle('get-app-version', () => {
    return { version: app.getVersion() };
  });
  
  // Backup do banco de dados
  ipcMain.handle('backup-database', async (event, backupPath) => {
    try {
      const database = new Database();
      const result = await database.backup(backupPath);
      return { success: true, path: result.path };
    } catch (error) {
      console.error('Erro ao fazer backup do banco de dados:', error);
      return { success: false, error: error.message };
    }
  });
  
  // Restauração do banco de dados
  ipcMain.handle('restore-database', async (event, backupPath) => {
    try {
      const database = new Database();
      await database.restore(backupPath);
      
      // Reiniciar aplicativo após restauração
      app.relaunch();
      app.exit(0);
      
      return { success: true };
    } catch (error) {
      console.error('Erro ao restaurar banco de dados:', error);
      return { success: false, error: error.message };
    }
  });
  
  // Configurações do sistema
  ipcMain.handle('get-setting', async (event, key) => {
    try {
      const database = new Database();
      const value = await database.getSetting(key);
      return { success: true, value };
    } catch (error) {
      console.error(`Erro ao buscar configuração ${key}:`, error);
      return { success: false, error: error.message };
    }
  });
  
  ipcMain.handle('set-setting', async (event, key, value) => {
    try {
      const database = new Database();
      await database.setSetting(key, value);
      return { success: true };
    } catch (error) {
      console.error(`Erro ao definir configuração ${key}:`, error);
      return { success: false, error: error.message };
    }
  });
}

// Criar janela quando o Electron estiver pronto
app.whenReady().then(initApp);

// Sair quando todas as janelas estiverem fechadas (exceto no macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Limpar recursos ao sair
app.on('before-quit', async () => {
  if (db) {
    try {
      await db.close();
    } catch (error) {
      console.error('Erro ao fechar banco de dados:', error);
    }
  }
});
