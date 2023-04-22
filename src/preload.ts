import type { IpcRendererEvent } from 'electron'
import * as iot from 'io-ts'
import { PathReporter } from "io-ts/PathReporter"
import { isRight } from "fp-ts/Either"
//import type { ICategory, ICard } from './interfaces'
//TODO: Trovare modo di importare le interfacce

/*interface DatabaseData {
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
}*/

const OptionReqSchema = iot.type({
    value: iot.string,
    icon: iot.string
})

const OptionParSchema = iot.partial({
    bg: iot.string,
    fg: iot.string
})

const OptionSchema = iot.intersection([OptionReqSchema, OptionParSchema])

const TagSchema = iot.type({
    type: iot.string,
    value: iot.string
})

const CardSchema = iot.type({
    name: iot.string,
    image: iot.string,
    added: iot.number,
    updated: iot.number,
    tags: iot.array(TagSchema)
})

const CategorySchema = iot.type({
    name: iot.string,
    icon: iot.string,
    options: iot.array(OptionSchema)
})

const SectionSchema = iot.type({
    name: iot.string,
    categories: iot.array(CategorySchema),
    cards: iot.array(CardSchema)
})

const DatabaseSchema = iot.type({
    current: iot.number,
    sections: iot.array(SectionSchema)
})

const parseDb = DatabaseSchema.decode
const reportDb = PathReporter.report

type DatabaseData = iot.TypeOf<typeof DatabaseSchema>

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
    saveDB: (json: string) => Promise<void>,
    importDB: () => Promise<DatabaseData>,
    exportDB: () => Promise<void>,
    onMessage: (callback: (event: IpcRendererEvent, res: string) => void) => void,
    onResize: (callback: (event: IpcRendererEvent, res: Resize) => void) => void,
    addCard: (callback: () => void) => void,
    saveCard: (callback: () => void) => void,
    onZoomChange: (callback: (event: IpcRendererEvent, zoom: number) => void) => void,
}

export {
    ContextBridgeApi, Properties, Resize, DatabaseData, parseDb, isRight as isValid, reportDb
}