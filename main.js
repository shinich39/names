import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import fs from "fs";

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 600,
    icon: path.join(process.cwd(), "resources/icons/512x512.png"),
    webPreferences: {
      preload: path.join(process.cwd(), 'preload.js'),
      worldSafeExecuteJavaScript: true,
      contextIsolation: true, // https://www.electronjs.org/docs/latest/tutorial/security
      nodeIntegration: false,
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile('index.html');

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Set event listeners.
  mainWindow.webContents.on("did-finish-load", function() {
    console.log("Electron window loaded");
  });

  mainWindow.webContents.on("close", function() {
    console.log("Electron window closed");
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  // if (process.platform !== 'darwin') {
  //   app.quit();
  // }

  app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.handle("isDirectory", function(event, filePath) {
  try {
    return fs.lstatSync(filePath).isDirectory() ? 1 : 0;
  } catch(err) {
    return -1;
  }
});

ipcMain.handle("isExists", function(event, filePath) {
  try {
    return fs.existsSync(filePath) ? 1 : 0;
  } catch(err) {
    return -1;
  }
});

ipcMain.handle("execute", function(event, data) {
  try {
    for (const {oldPath, newPath} of data) {
      fs.renameSync(oldPath, newPath);
    }
    return 1;
  } catch(err) {
    return -1;
  }
});
