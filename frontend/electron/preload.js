const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Example: Platform detection
  platform: process.platform,
  
  // Example: App version
  version: process.env.npm_package_version,
  
  // Example: IPC communication methods (add as needed)
  on: (channel, func) => {
    const validChannels = ['update-available', 'update-downloaded'];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
  
  send: (channel, data) => {
    const validChannels = ['app-close', 'app-minimize', 'app-maximize'];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  
  // Add more methods as needed for your app
}); 