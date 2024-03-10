const {
  contextBridge,
  ipcRenderer,
} = require('electron');

window.addEventListener('DOMContentLoaded', function() {
  // DOM loaded...
});

// window.electron 
contextBridge.exposeInMainWorld('utils', {
  getProcess: function() {
    return {
      node: process.versions.node,
      chrome: process.versions.chrome,
      electron: process.versions.electron,
    }
  },
  send: function(channel, data) {
    ipcRenderer.send(channel, data);
  },
  receive: function(channel, listener) {
    ipcRenderer.on(channel, listener);
  },
  invoke: function(channel, data) {
    return ipcRenderer.invoke(channel, data);
  },
});