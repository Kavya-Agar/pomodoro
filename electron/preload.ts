import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  startTimer: (duration: number) => ipcRenderer.invoke('start-timer', duration),
  stopTimer: () => ipcRenderer.invoke('stop-timer'),
  onTick: (callback: (remainingTime: number) => void) => {
    const listener = (_: IpcRendererEvent, remainingTime: number) => callback(remainingTime);
    ipcRenderer.on('timer-tick', listener);
    return () => ipcRenderer.removeListener('timer-tick', listener);
  },
});
