// Native
import { join } from 'path';
import urlparser from 'url';
import os from "os";
import fs from 'fs';

// Packages
import { BrowserWindow, app, ipcMain, IpcMainEvent, screen } from 'electron';
import isDev from 'electron-is-dev';
import { exec } from 'child_process';

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
      preload: join(__dirname, 'preload.js'),
      nodeIntegration: true,
    }
  });

  var urlformat = urlparser.format({
    pathname: join(__dirname, '../src/out/index.html'),
    hash: '/app',
    protocol: 'file:',
    slashes: true
  })

  const port = process.env.PORT || 3000;
  const url = isDev ? `http://localhost:${port}/#/app` : urlformat;

  // and load the index.html of the app.
  if (isDev) {
    window?.loadURL(url);
    window.webContents.openDevTools();
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
            // window.setSkipTaskbar(true);
            window.setAlwaysOnTop(true);
          }
        }
      });
    },10000);
  } else {
    window?.loadURL(url);
    // window.webContents.openDevTools();
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
          // window.setSkipTaskbar(true);
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
          // window.setSkipTaskbar(true);
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
            // window.setSkipTaskbar(true);
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
        // skipTaskbar: true,
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

      var receipturl = urlparser.format({
        pathname: join(__dirname, '../src/out/index.html'),
        hash: '/external/receipt',
        protocol: 'file:',
        slashes: true
      });

      if (!isDev) {
        // mainWindow.webContents.openDevTools()
        await receiptWindow.loadURL(receipturl);
      } else {
        await receiptWindow.loadURL(`http://localhost:${port}/#/external/receipt`)
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
        // skipTaskbar: true,
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

      var generateurl = urlparser.format({
        pathname: join(__dirname, '../src/out/index.html'),
        hash: '/external/generatereport',
        protocol: 'file:',
        slashes: true
      });

      if (!isDev) {
        // mainWindow.webContents.openDevTools()
        await generateReportWindow.loadURL(generateurl)
      } else {
        await generateReportWindow.loadURL(`http://localhost:${port}/#/external/generatereport`)
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
          // skipTaskbar: true,
          fullscreen: false,
          alwaysOnTop: true,
          x: externalDisplay.bounds.x,
          y: externalDisplay.bounds.y,
          webPreferences: {
            preload: join(__dirname, 'preload.js'),
            nodeIntegration: true,
          },
        })

        var invoiceurl = urlparser.format({
          pathname: join(__dirname, '../src/out/index.html'),
          hash: '/external/invoice',
          protocol: 'file:',
          slashes: true
        });
  
        if (!isDev) {
          // mainWindow.webContents.openDevTools()
          await externalWindow.loadURL(invoiceurl);
        } else {
          await externalWindow.loadURL(`http://localhost:${port}/#/external/invoice`)
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

  ipcMain.on('restart-report-window', async () => {
    try{
      if(generateReportWindow){
        console.log("GENERATE WINDOW CL ST: ", generateReportWindow.isClosable());
        if(generateReportWindow.isClosable()){
          generateReportWindow.close();
        }
        generateReportWindow = null;
        generateReportWindow = new BrowserWindow({
          // kiosk: true,
          title: 'generate_report',
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
        
        var generateurl = urlparser.format({
          pathname: join(__dirname, '../src/out/index.html'),
          hash: '/external/generatereport',
          protocol: 'file:',
          slashes: true
        });
  
        if (!isDev) {
          // mainWindow.webContents.openDevTools()
          await generateReportWindow.loadURL(generateurl)
        } else {
          await generateReportWindow.loadURL(`http://localhost:${port}/#/external/generatereport`)
          setTimeout(() => {
            if(generateReportWindow){
              generateReportWindow.reload();
            }
          },10000);
          // mainWindow.webContents.openDevTools()
        }
      }
      else{
        generateReportWindow = new BrowserWindow({
          // kiosk: true,
          title: 'generate_report',
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
        
        var generateurl = urlparser.format({
          pathname: join(__dirname, '../src/out/index.html'),
          hash: '/external/generatereport',
          protocol: 'file:',
          slashes: true
        });
  
        if (!isDev) {
          // mainWindow.webContents.openDevTools()
          await generateReportWindow.loadURL(generateurl)
        } else {
          await generateReportWindow.loadURL(`http://localhost:${port}/#/external/generatereport`)
          setTimeout(() => {
            if(generateReportWindow){
              generateReportWindow.reload();
            }
          },10000);
          // mainWindow.webContents.openDevTools()
        }
      }
    }catch(ex){
      console.log("GEN WINDOW ERR: ", ex);
    }
  })

  ipcMain.on('restart-receipt-window', async () => {
    try{
      if(receiptWindow){
        console.log("RECEIPT WINDOW: ", receiptWindow.isClosable());
        if(receiptWindow.isClosable()){
          receiptWindow.close();
        }
        receiptWindow = null;
        receiptWindow = new BrowserWindow({
          // kiosk: true,
          title: 'receipt',
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
        
        var receipturl = urlparser.format({
          pathname: join(__dirname, '../src/out/index.html'),
          hash: '/external/receipt',
          protocol: 'file:',
          slashes: true
        });
  
        if (!isDev) {
          // mainWindow.webContents.openDevTools()
          await receiptWindow.loadURL(receipturl);
        } else {
          await receiptWindow.loadURL(`http://localhost:${port}/#/external/receipt`)
          setTimeout(() => {
            if(receiptWindow){
              receiptWindow.reload();
            }
          },10000);
          // mainWindow.webContents.openDevTools()
        }
      }
      else{
        receiptWindow = new BrowserWindow({
          // kiosk: true,
          title: 'receipt',
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
        
        var receipturl = urlparser.format({
          pathname: join(__dirname, '../src/out/index.html'),
          hash: '/external/receipt',
          protocol: 'file:',
          slashes: true
        });
  
        if (!isDev) {
          // mainWindow.webContents.openDevTools()
          await receiptWindow.loadURL(receipturl);
        } else {
          await receiptWindow.loadURL(`http://localhost:${port}/#/external/receipt`)
          setTimeout(() => {
            if(receiptWindow){
              receiptWindow.reload();
            }
          },10000);
          // mainWindow.webContents.openDevTools()
        }
      }
    }catch(ex){
      console.log("REC WINDOW ERR: ", ex);
    }
  })

  ipcMain.on('ready-print', async (_, command) => {
    if(receiptWindow){
      receiptWindow.webContents.send('receipt-output', command);
    }
  })

  ipcMain.on('ready-generate', async (_, command) => {
    if(generateReportWindow){
      generateReportWindow.webContents.send('report-output', command);
    }
  })

  ipcMain.on('print-receipt', async () => {
    if(receiptWindow){
      console.log("Printing");
      receiptWindow.webContents.print({});
    }
  });

  ipcMain.on('print-report', async () => {
    if(generateReportWindow){
      console.log("Printing");
      generateReportWindow.webContents.print({});
    }
  });

  ipcMain.on('close-external', async () => {
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
            // window.setSkipTaskbar(true);
            window.setAlwaysOnTop(true);
          }
        }
      });
    }

    if(externalWindow){
      externalWindow.close();
      externalWindow = null;
    }

    if(receiptWindow){
      receiptWindow.close();
      receiptWindow = null;
    }

    if(generateReportWindow){
      generateReportWindow.close();
      generateReportWindow = null;
    }
  });

  // Listen for user input
  ipcMain.on('display-invoice', (_, command) => {
    if(externalWindow){
      externalWindow.webContents.send('receive-invoice', command);
    }
  })
  
  ipcMain.on('execute-command', (_, command) => {
    executeCommand(command)
      .then(output => {
        window.webContents.send('command-output', output);
      })
      .catch(error => {
        window.webContents.send('command-error', error.message);
      });
  });

  ipcMain.on('execute-command-w-dir', (_, command) => {
    const parsedcommand = JSON.parse(command);
    executeCommandWDir(parsedcommand.cmd, parsedcommand.dir)
      .then(output => {
        window.webContents.send('command-output', output);
      })
      .catch(error => {
        window.webContents.send('command-error', error.message);
      });
  });

  ipcMain.on('get-directories', (_, command) => {
    try{
      if(command.trim() === ""){
        const defaultpath = os.platform() === "linux" ? "\\" : "C:\\";
        const result = fs.readdirSync(defaultpath, { withFileTypes: true });
        const directories = result.filter((flt) => flt.isDirectory()).map((mp) => `${defaultpath}\\${mp.name}`);
        const files = result.filter((flt) => !flt.isDirectory()).map((mp) => `${defaultpath}\\${mp.name}`);
        // console.log({ path: defaultpath, dirs: directories, files: files });
        window.webContents.send('get-directories-output', JSON.stringify({ path: defaultpath, dirs: directories, files: files }));
      }
      else{
        const result = fs.readdirSync(command, { withFileTypes: true });
        const directories = result.filter((flt) => flt.isDirectory()).map((mp) => `${command}\\${mp.name}`);
        const files = result.filter((flt) => !flt.isDirectory()).map((mp) => `${command}\\${mp.name}`);
        // console.log({ path: command, dirs: directories, files: files });
        window.webContents.send('get-directories-output', JSON.stringify({ path: command, dirs: directories, files: files }));
      }
    }
    catch(ex){
      window.webContents.send('get-directories-error', `Error Get Directories: ${ex}`);
    }
  });

  // Function to execute shell commands
  function executeCommand(command: any) {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, _) => {
        if (error) {
          reject(error);
        } else {
          resolve(stdout);
        }
      });
    });
  }

  function executeCommandWDir(command: any, dir: any) {
    return new Promise((resolve, reject) => {
      exec(command, { cwd: dir }, (error, stdout, _) => {
        if (error) {
          reject(error);
        } else {
          resolve(stdout);
        }
      });
    });
  }
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
