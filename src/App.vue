<script setup lang="ts">
import { RouterView } from 'vue-router'
import { Icon } from '@iconify/vue'
import Tooltip from '@components/Tooltip.vue'
import Header from '@components/Header.vue'
import { ref } from 'vue'

const isMaximized = ref(false), winTitle = ref("")

window.electron.getProperties().then(p => {
    isMaximized.value = p.isMaximized
    winTitle.value = p.title
})

window.electron.onResize((_, obj) => {
    isMaximized.value = obj.isMaximized
})

const windowAction = (action: string) => {
    switch (action) {
        case "minimize":
            window.electron.minimize()
            break
        case "maximize":
            window.electron.maximize()
            break
        case "unmaximize":
            window.electron.unmaximize()
            break
        case "close":
            window.electron.close()
            break
        default:
            break
    }
}
</script>

<template>
    <div class="flex flex-col h-screen min-h-screen transition-colors selection:bg-secondary-focus bg-base-100 scroll-smooth">
        <div class="min-h-0 p-0 select-none shrink-0 navbar bg-primary-focus" style="-webkit-app-region: drag">
            <div class="gap-2 ml-2 navbar-start">
                <img class="object-cover object-center w-4 h-4" draggable="false" src="/favicon.ico" />
                <p class="text-sm font-extrabold text-base-100">{{ winTitle }}</p>
            </div>
            <div class="navbar-end">
                <Tooltip content="Minimize window">
                    <button tabindex="-1" class="rounded-none btn btn-xs btn-ghost text-base-100" @click="windowAction('minimize')"
                        aria-label="Minimize window" style="-webkit-app-region: no-drag">
                        <Icon icon="fluent:subtract-16-filled" class="w-5 h-5" />
                    </button>
                </Tooltip>
                <Tooltip :content="isMaximized ? 'Unmaximize window' : 'Maximize window'">
                    <button tabindex="-1" class="rounded-none btn btn-xs btn-ghost text-base-100" @click="windowAction(isMaximized ? 'unmaximize' : 'maximize')"
                        aria-label="Unmaximize window" style="-webkit-app-region: no-drag">
                        <Icon :icon="isMaximized ? 'fluent:full-screen-minimize-16-filled' : 'fluent:full-screen-maximize-16-filled'" class="w-5 h-5" />
                    </button>
                </Tooltip>
                <Tooltip content="Close window">
                    <button tabindex="-1" class="rounded-none btn btn-xs btn-ghost hover:bg-error hover:brightness-90 text-base-100"
                        aria-label="Close window" style="-webkit-app-region: no-drag" @click="windowAction('close')">
                        <Icon icon="fluent:dismiss-16-filled" class="w-5 h-5" />
                    </button>
                </Tooltip>
            </div>
        </div>
        <Header />
        <RouterView />
    </div>
</template>