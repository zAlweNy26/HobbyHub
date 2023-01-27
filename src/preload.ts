interface Properties {
    zoom: number
    title: string
    isMinimized: boolean
}

interface Resize {
    isMaximized: boolean,
    size: {
        width: number,
        height: number
    }
}

type ContextBridgeApi = {
    setZoom: (perc: number) => Promise<void>,
    minimize: () => Promise<void>,
    maximize: () => Promise<void>,
    unmaximize: () => Promise<void>,
    close: () => Promise<void>,
    getProperties: () => Promise<Properties & Resize>,
    onResize: (callback: (event: Electron.IpcRendererEvent, res: Resize) => void) => void
}

export {
    ContextBridgeApi, Properties, Resize
}