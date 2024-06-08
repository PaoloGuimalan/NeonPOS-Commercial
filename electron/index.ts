// Native
import { join } from 'path';

// Packages
import { BrowserWindow, app, ipcMain, IpcMainEvent, screen } from 'electron';
import isDev from 'electron-is-dev';

var externalWindow: Electron.BrowserWindow | null = null;
var receiptWindow: Electron.BrowserWindow | null = null;
var generateReportWindow: Electron.BrowserWindow | null = null;

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  const displays = screen.getAllDisplays();
  const externalDisplay = displays.find((display) => {
    return display.bounds.x !== 0 || display.bounds.y !== 0
  })
  // Create the browser window.
  const window = new BrowserWindow({
    width: width,
    height: height,
    //  change to false to use AppBar
    frame: false,
    titleBarStyle: "hidden",
    skipTaskbar: false,
    alwaysOnTop: true,
    show: true,
    webPreferences: {
      preload: join(__dirname, 'preload.js')
    }
  });

  const port = process.env.PORT || 3000;
  const url = isDev ? `http://localhost:${port}` : join(__dirname, '../src/out/index.html');

  // and load the index.html of the app.
  if (isDev) {
    window?.loadURL(url);
    setTimeout(() => {
      window.reload();
      window.webContents
      .executeJavaScript('localStorage.getItem("settings");', true)
      .then(result => {
        const ls = JSON.parse(result);
        if(ls){
          if(ls.setup === "Portable"){
            window.setSkipTaskbar(false);
            window.setAlwaysOnTop(false);
          }
          else if(ls.setup === "POS"){
            window.setSkipTaskbar(true);
            window.setAlwaysOnTop(true);
          }
        }
      });
    },10000);
  } else {
    window?.loadFile(url);
    window.webContents
    .executeJavaScript('localStorage.getItem("settings");', true)
    .then(result => {
      const ls = JSON.parse(result);
      if(ls){
        if(ls.setup === "Portable"){
          window.setSkipTaskbar(false);
          window.setAlwaysOnTop(false);
        }
        else if(ls.setup === "POS"){
          window.setSkipTaskbar(true);
          window.setAlwaysOnTop(true);
        }
      }
    });
  }
  // Open the DevTools.
  // window.webContents.openDevTools();

  // For AppBar
  ipcMain.on('minimize', () => {
    // eslint-disable-next-line no-unused-expressions
    window.isMinimized() ? window.restore() : window.minimize();
    // or alternatively: win.isVisible() ? win.hide() : win.show()
  });
  ipcMain.on('maximize', () => {
    // eslint-disable-next-line no-unused-expressions
    window.isMaximized() ? window.restore() : window.maximize();
  });

  ipcMain.on('close', () => {
    window.close();
  });

  ipcMain.on("setup-type-reload", async (_, command) => {
    if(window){
      if(command){
        if(command === "Portable"){
          window.setSkipTaskbar(false);
          window.setAlwaysOnTop(false);
        }
        else if(command === "POS"){
          window.setSkipTaskbar(true);
          window.setAlwaysOnTop(true);
        }
      }
    }
  })

  ipcMain.on('enable-external', async (__, ___) => {
    if(window){
      window.webContents
      .executeJavaScript('localStorage.getItem("settings");', true)
      .then(result => {
        const ls = JSON.parse(result);
        if(ls){
          if(ls.setup === "Portable"){
            window.setSkipTaskbar(false);
            window.setAlwaysOnTop(false);
          }
          else if(ls.setup === "POS"){
            window.setSkipTaskbar(true);
            window.setAlwaysOnTop(true);
          }
        }
      });
    }

    if(!receiptWindow){
      receiptWindow = new BrowserWindow({
        // kiosk: true,
        title: "receipt",
        width: 300,
        height: 0,
        frame: false,
        skipTaskbar: true,
        fullscreen: false,
        x: 0,
        y: height + 30,
        resizable: false,
        // alwaysOnTop: true,
        webPreferences: {
          preload: join(__dirname, 'preload.js'),
          nodeIntegration: true,
        },
      })
      receiptWindow.on("close", () => {
        receiptWindow = null;
      });
      if (!isDev) {
        // mainWindow.webContents.openDevTools()
        await receiptWindow.loadURL('app://./external/receipt')
      } else {
        await receiptWindow.loadURL(`http://localhost:${port}/external/receipt`)
        setTimeout(() => {
          if(receiptWindow){
            receiptWindow.reload();
          }
        },10000);
        // mainWindow.webContents.openDevTools()
      }
    }

    if(!generateReportWindow){
      generateReportWindow = new BrowserWindow({
        // kiosk: true,
        title: "generate_report",
        width: 300,
        height: 0,
        frame: false,
        skipTaskbar: true,
        fullscreen: false,
        x: 0,
        y: height + 30,
        resizable: false,
        // alwaysOnTop: true,
        webPreferences: {
          preload: join(__dirname, 'preload.js'),
          nodeIntegration: true,
        },
      })
      generateReportWindow.on("close", () => {
        generateReportWindow = null;
      });
      if (!isDev) {
        // mainWindow.webContents.openDevTools()
        await generateReportWindow.loadURL('app://./external/generatereport')
      } else {
        await generateReportWindow.loadURL(`http://localhost:${port}/external/generatereport`)
        setTimeout(() => {
          if(generateReportWindow){
            generateReportWindow.reload();
          }
        },10000);
        // mainWindow.webContents.openDevTools()
      }
    }

    if(!externalWindow){
      if(externalDisplay){
        externalWindow = new BrowserWindow({
          // kiosk: true,
          title: "external",
          width: width,
          height: height,
          frame: false,
          skipTaskbar: true,
          fullscreen: false,
          alwaysOnTop: true,
          x: externalDisplay.bounds.x,
          y: externalDisplay.bounds.y,
          webPreferences: {
            preload: join(__dirname, 'preload.js'),
            nodeIntegration: true,
          },
        })
  
        if (!isDev) {
          // mainWindow.webContents.openDevTools()
          await externalWindow.loadURL('app://./external/external')
        } else {
          await externalWindow.loadURL(`http://localhost:${port}/external/external`)
          setTimeout(() => {
            if(externalWindow){
              externalWindow.reload();
            }
          },10000);
          // mainWindow.webContents.openDevTools()
        }
      }
    }
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// listen the channel `message` and resend the received message to the renderer process
ipcMain.on('message', (event: IpcMainEvent, message: any) => {
  console.log(message);
  setTimeout(() => event.sender.send('message', 'hi from electron'), 500);
});
