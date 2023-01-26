import { contextBridge, ipcRenderer } from "electron"

type ContextBridgeApi = {
  setZoom: (perc: number) => Promise<void>
}

const exposedApi: ContextBridgeApi = {
  setZoom: (perc: number) => ipcRenderer.invoke('zoom-win', perc)
}

contextBridge.exposeInMainWorld('electron', exposedApi)

export {
  ContextBridgeApi
}