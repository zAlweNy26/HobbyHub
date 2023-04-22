import type { IpcRendererEvent } from "electron"
import { contextBridge, ipcRenderer } from "electron"
import type { ContextBridgeApi, Resize } from '../../src/preload'

const exposedApi: ContextBridgeApi = {
  setZoom: (perc: number) => ipcRenderer.invoke('set-zoom', perc),
  minimize: () => ipcRenderer.invoke('minimize-win'),
  maximize: () => ipcRenderer.invoke('maximize-win'),
  unmaximize: () => ipcRenderer.invoke('unmaximize-win'),
  close: () => ipcRenderer.invoke('close-win'),
  getProperties: () => ipcRenderer.invoke('win-properties'),
  getDB: () => ipcRenderer.invoke('get-db'),
  saveDB: (json: string) => ipcRenderer.invoke('save-db', json),
  importDB: () => ipcRenderer.invoke('import-db'),
  exportDB: () => ipcRenderer.invoke('export-db'),
  onMessage: (callback: (event: IpcRendererEvent, res: string) => void) => {
    ipcRenderer.on('page-message', (e, args) => callback(e, args))
  },
  onResize: (callback: (event: IpcRendererEvent, res: Resize) => void) => {
    ipcRenderer.on('resize-win', (e, args) => callback(e, JSON.parse(args)))
  },
  saveCard: (callback: () => void) => ipcRenderer.on('save-card', () => callback()),
  addCard: (callback: () => void) => ipcRenderer.on('add-card', () => callback()),
  onZoomChange: (callback: (event: IpcRendererEvent, zoom: number) => void) => {
    ipcRenderer.on('zoom-change', (e, args) => callback(e, args))
  }
}

contextBridge.exposeInMainWorld('electron', exposedApi)