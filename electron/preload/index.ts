import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron"
import { ContextBridgeApi, Resize } from '../../src/preload'

const exposedApi: ContextBridgeApi = {
  setZoom: (perc: number) => ipcRenderer.invoke('set-zoom', perc),
  minimize: () => ipcRenderer.invoke('minimize-win'),
  maximize: () => ipcRenderer.invoke('maximize-win'),
  unmaximize: () => ipcRenderer.invoke('unmaximize-win'),
  close: () => ipcRenderer.invoke('close-win'),
  getProperties: () => ipcRenderer.invoke('win-properties'),
  onResize: (callback: (event: IpcRendererEvent, res: Resize) => void) => {
    ipcRenderer.on('resize-win', (e, args) => callback(e, JSON.parse(args)))
  }
}

contextBridge.exposeInMainWorld('electron', exposedApi)