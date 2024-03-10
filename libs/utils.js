import {
  app,
  BrowserWindow,
  dialog,
  Menu,
} from 'electron';

const _ = {
  app: app.name,
  pid: process.pid,
  isMac: process.platform === 'darwin',
  isWin: process.platform === 'win32',
  isLinux: process.platform === 'linux',
  homePath: app.getPath("home"),
  appPath: app.getPath("appData"),
  userPath: app.getPath("userData"),
  sessionPath: app.getPath("sessionData"),
  tempPath: app.getPath("temp"),
  exePath: app.getPath("exe"),
  modulePath: app.getPath("module"),
  desktopPath: app.getPath("desktop"),
  documentsPath: app.getPath("documents"),
  downloadsPath: app.getPath("downloads"),
  picturesPath: app.getPath("pictures"),
  videosPath: app.getPath("videos"),
  musicPath: app.getPath("music"),
  logsPath: app.getPath("logs"),
  crashDumpsPath: app.getPath("crashDumps"),
}

function isMac() {
  return _.isMac;
}

function isWin() {
  return _.isWin;
}

function isLinux() {
  return _.isLinux;
}

function getPath() {
  return {
    documents: _.documentsPath,
    desktop: _.desktopPath,
    downloads: _.downloadsPath,
    home: _.homePath,
    app: _.appPath,
    user: _.userPath,
    session: _.sessionPath,
    temp: _.tempPath,
    exe: _.exePath,
    module: _.modulePath,
    desktop: _.desktopPath,
    documents: _.documentsPath,
    downloads: _.downloadsPath,
    pictures: _.picturesPath,
    videos: _.videosPath,
    music: _.musicPath,
    logs: _.logsPath,
    crashDumps: _.crashDumpsPath,
  }
}

function getPid() {
  return _.pid;
}

function setEventLimit(n) {
  require('events').EventEmitter.defaultMaxListeners = n || 10; // default 10
}

function getFocusedWindow() {
  return BrowserWindow.getFocusedWindow();
}

function getWindows() {
  return BrowserWindow.getAllWindows();
}

function alert(title, message) {
  if (!message) {
    dialog.showMessageBoxSync({
      message: title
    });
  } else {
    dialog.showMessageBoxSync({
      title: title,
      message: message
    });
  }
}

async function confirm(title, message) {
  if (!message) {
    const { response } = await dialog.showMessageBox({
      type: 'info',
      buttons: ['확인', '취소'],
      cancelId: 1,
      defaultId: 0,
      title: message,
    });

    return response === 0;
  } else {
    const { response } = await dialog.showMessageBox({
      type: 'info',
      buttons: ['확인', '취소'],
      cancelId: 1,
      defaultId: 0,
      title: title,
      detail: message,
    });

    return response === 0;
  }
}

function setMenu() {
  const menu = _.isMac ? {
    [app.name]: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideOthers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ],
    File: [
      { role: 'close' }
    ],
    Edit: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'pasteAndMatchStyle' },
      { role: 'delete' },
      { role: 'selectAll' },
      { type: 'separator' },
      {
        label: 'Speech',
        submenu: [
          { role: 'startSpeaking' },
          { role: 'stopSpeaking' }
        ]
      }
    ],
    View: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ],
    Window: [
      { role: 'minimize' },
      { role: 'zoom' },
      { type: 'separator' },
      { role: 'front' },
      { type: 'separator' },
      { role: 'window' }
    ],
    Help: [
      {
        label: 'Learn More',
        accelerator: "Cmd + H",
        click: async function() {
          const { shell } = require('electron');
          await shell.openExternal('https://electronjs.org')
        }
      }
    ]
  } : {
    File: [
      { role: 'quit' }
    ],
    Edit: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'delete' },
      { type: 'separator' },
      { role: 'selectAll' }
    ],
    View: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ],
    Window: [
      { role: 'minimize' },
      { role: 'zoom' },
      { role: 'close' }
    ],
    Help: [
      {
        label: 'Learn More',
        accelerator: "Ctrl + H",
        click: async function() {
          const { shell } = require('electron');
          await shell.openExternal('https://electronjs.org')
        }
      }
    ]
  };
  
  const tmp = [];
  for (const label of Object.keys(menu)) {
    tmp.push({
      label: label,
      submenu: menu[label],
    });
  }
  
  const template = Menu.buildFromTemplate(tmp);

  Menu.setApplicationMenu(template);
}

export default {
  isMac: isMac,
  isWin: isWin,
  isLinux: isLinux,
  getPath: getPath,
  getPid: getPid,
  setEventLimit: setEventLimit,
  getWindows: getWindows,
  getFocusedWindow: getFocusedWindow,
  alert: alert,
  confirm: confirm,
  setMenu: setMenu,
}