"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electronAPI", {
  startTimer: (duration) => electron.ipcRenderer.invoke("start-timer", duration),
  stopTimer: () => electron.ipcRenderer.invoke("stop-timer"),
  onTick: (callback) => {
    const listener = (_, remainingTime) => callback(remainingTime);
    electron.ipcRenderer.on("timer-tick", listener);
    return () => electron.ipcRenderer.removeListener("timer-tick", listener);
  }
});
