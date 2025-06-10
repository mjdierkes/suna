const { app, BrowserWindow } = require('electron');
const serve = require('electron-serve');
const path = require('path');

const isDev = !app.isPackaged;
const isProd = !isDev;

if (isProd) {
  serve({ directory: 'out' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

const createWindow = async () => {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      // Add preload script if needed later
      // preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../public/favicon.ico'),
    titleBarStyle: 'default', // Use default title bar for better window control
    show: false, // Don't show until ready
  });

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    
    // Only open dev tools in development
    if (isDev) {
      mainWindow.webContents.openDevTools();
    }
  });

  try {
    if (isProd) {
      await mainWindow.loadURL('app://./index.html');
    } else {
      const port = process.argv[2] || 3000;
      await mainWindow.loadURL(`http://localhost:${port}`);
    }
  } catch (error) {
    console.error('Failed to load URL:', error);
  }
};

app.whenReady().then(createWindow);

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