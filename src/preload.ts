import type { IpcRendererEvent } from 'electron'
//import type { ICategory, ICard } from './interfaces'
//TODO: Trovare modo di importare le interfacce
type DatabaseData = {
    current: number,
    sections: {
        name: string,
        categories: {
            name: string
            icon: string
            options: {
                value: string
                icon: string
                bg?: string
                fg?: string
            }[]
        }[],
        cards: {
            name: string
            image: string
            added: number
            updated: number
            tags: {
                type: string
                value: string
            }[]
        }[]
    }[]
}

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
    getDB: () => Promise<DatabaseData>,
    saveDB: (db: DatabaseData) => Promise<void>,
    onMessage: (callback: (event: IpcRendererEvent, res: string) => void) => void
    onResize: (callback: (event: IpcRendererEvent, res: Resize) => void) => void
}

export {
    ContextBridgeApi, Properties, Resize, DatabaseData
}