// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { MadaraConfig } from './madara';

export type Channels = 'ipc-example' | 'madara_start';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    madara: {
      setup: (config: MadaraConfig) =>
        ipcRenderer.invoke('madara-setup', config),
      start: (config: MadaraConfig) =>
        ipcRenderer.invoke('madara-start', config),
      stop: () => ipcRenderer.invoke('madara-stop'),
      onDownloadProgress: (callback: any) =>
        ipcRenderer.on('download-progress', callback),
      onNodeLogs: (callback: any) => ipcRenderer.on('node-logs', callback),
      onNodeStop: (callback: any) => ipcRenderer.on('node-stop', callback),
      releaseExists: (config: MadaraConfig) =>
        ipcRenderer.invoke('release-exists', config),
      childProcessInMemory: () => ipcRenderer.invoke('child-process-in-memory'),
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
