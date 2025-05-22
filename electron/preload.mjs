import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  onMainMessage: (callback) => ipcRenderer.on('main-process-message', (_event, message) => callback(message)),
  onTick: (callback) => ipcRenderer.on('timer-tick', (_event, time) => callback(time)),
  startTimer: (duration) => ipcRenderer.invoke('start-timer', duration),
  stopTimer: () => ipcRenderer.invoke('stop-timer'),
})