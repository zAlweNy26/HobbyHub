import type { ContextBridgeApi } from '@electron/preload/index'

declare global {
    interface Window {
        electron: ContextBridgeApi
    }
}