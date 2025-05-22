import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';

let mainWindow: BrowserWindow | null = null;
let remainingTime: number = 0;
let timerInterval: NodeJS.Timeout | null = null;

// Register handlers here, at the top level!
ipcMain.handle('start-timer', async (_event, duration: number) => {
  remainingTime = duration;
  timerInterval = setInterval(() => {
    if (remainingTime > 0) {
      remainingTime--;
      mainWindow?.webContents.send('timer-tick', remainingTime);
    } else {
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
    }
  }, 1000);
});

ipcMain.handle('stop-timer', async () => {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'dist-electron/preload.mjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadURL('http://localhost:3000');
  mainWindow.webContents.openDevTools({ mode: 'detach' });
}

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
