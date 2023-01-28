<script setup lang="ts">
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import { Icon } from '@iconify/vue'
import Tooltip from '@components/Tooltip.vue'
import ListHandler from '@components/ListHandler.vue'
import { useHeaderStore } from '@stores/headerStore'
import { Status, ViewMode, Order, Platform } from '@/interfaces'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

const header = useHeaderStore()
const { currentSection, filters, viewMode, sortings } = storeToRefs(header)

const isMaximized = ref(false), showStatus = ref(false), showPlatform = ref(false)
const zoom = ref(100), winTitle = ref("")

window.electron.getProperties().then(p => {
    zoom.value = p.zoom * 100
    isMaximized.value = p.isMaximized
    winTitle.value = p.title
})

window.electron.onResize((_, obj) => {
    isMaximized.value = obj.isMaximized
})

const updateZoom = (perc: number) => {
    zoom.value = Math.max(10, Math.min(200, zoom.value += perc))
    window.electron.setZoom(zoom.value)
}

const updateName = (event: FocusEvent) => {
    const target = event.target as HTMLSpanElement
    currentSection.value = target.innerText.trim()
}

const blurOnEnter = (event: KeyboardEvent) => {
    const target = event.target as HTMLElement
    if (event.key == "Enter") target.blur()
}

const updateAlphabeticalOrder = () => {
    if (sortings.value.alphabet == Order.Ascending) sortings.value.alphabet = Order.Descending
    else if (sortings.value.alphabet == Order.Descending) sortings.value.alphabet = Order.None
    else sortings.value.alphabet = Order.Ascending
}

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
    <div class="flex flex-col">
        <div class="min-h-0 p-0 select-none navbar bg-primary-focus" style="-webkit-app-region: drag">
            <div class="gap-2 ml-2 navbar-start">
                <img class="object-cover object-center w-4 h-4" draggable="false" src="/favicon.ico" />
                <p class="text-sm font-extrabold text-base-100">{{ winTitle }}</p>
            </div>
            <div class="navbar-end">
                <Tooltip content="Minimize window">
                    <button class="rounded-none btn btn-xs btn-ghost text-base-100" @click="windowAction('minimize')"
                        aria-label="Minimize window" style="-webkit-app-region: no-drag">
                        <Icon icon="fluent:subtract-16-filled" class="w-5 h-5" />
                    </button>
                </Tooltip>
                <Tooltip :content="isMaximized ? 'Unmaximize window' : 'Maximize window'">
                    <button v-if="isMaximized" class="rounded-none btn btn-xs btn-ghost text-base-100" @click="windowAction('unmaximize')"
                        aria-label="Maximize window" style="-webkit-app-region: no-drag">
                        <Icon icon="fluent:full-screen-minimize-16-filled" class="w-5 h-5" />
                    </button>
                    <button v-else class="rounded-none btn btn-xs btn-ghost text-base-100" @click="windowAction('maximize')"
                        aria-label="Unmaximize window" style="-webkit-app-region: no-drag">
                        <Icon icon="fluent:full-screen-maximize-16-filled" class="w-5 h-5" />
                    </button>
                </Tooltip>
                <Tooltip content="Close window">
                    <button  class="rounded-none btn btn-xs btn-ghost hover:bg-error hover:brightness-90 text-base-100" 
                        aria-label="Close window" style="-webkit-app-region: no-drag" @click="windowAction('close')">
                        <Icon icon="fluent:dismiss-16-filled" class="w-5 h-5" />
                    </button>
                </Tooltip>
            </div>
        </div>
        <div class="min-h-0 navbar p-1.5 bg-primary">
            <div class="gap-2 navbar-start">
                <Tooltip content="Menu">
                    <label class="btn btn-sm btn-ghost btn-square text-base-100 swap swap-rotate" aria-label="Menu">
                        <input type="checkbox" class="modal-toggle" />
                        <Icon icon="fluent:navigation-24-filled" class="w-6 h-6 swap-off" />
                        <Icon icon="fluent:dismiss-24-filled" class="w-6 h-6 swap-on" />
                    </label>
                </Tooltip>
                <span class="font-bold truncate text-base-100 text-ellipsis" contenteditable="true"
                    @focusout="updateName" @keypress="blurOnEnter">{{ currentSection }}</span>
            </div>
            <div class="flex gap-2 navbar-end">
                <div class="flex items-center shrink-0 justify-center gap-2 py-0.5 px-1 overflow-hidden rounded-full select-none outline-2 outline outline-base-100">
                    <Tooltip content="Zoom out">
                        <button class="btn btn-xs btn-ghost btn-circle text-base-100" aria-label="Zoom out"
                            @click="updateZoom(-10)">
                            <Icon icon="fluent:zoom-out-24-filled" class="w-6 h-6" />
                        </button>
                    </Tooltip>
                    <span class="text-xs font-bold text-base-100">{{ Math.round(zoom) }}%</span>
                    <Tooltip content="Zoom in">
                        <button class="btn btn-xs btn-ghost btn-circle text-base-100" aria-label="Zoom in"
                            @click="updateZoom(10)">
                            <Icon icon="fluent:zoom-in-24-filled" class="w-6 h-6" />
                        </button>
                    </Tooltip>
                </div>
                <div class="mx-0 before:rounded-t-xl after:rounded-b-xl divider divider-horizontal after:bg-base-100/25 before:bg-base-100/25"></div>
                <Popover v-slot="{ open }" class="relative">
                    <PopoverButton as="template">
                        <Tooltip content="Sorting" :disable="open">
                            <button class="btn btn-sm btn-ghost btn-square text-base-100" 
                                aria-label="Sorting" @click="showStatus = showPlatform = false">
                                <Icon icon="fluent:arrow-sort-down-lines-24-filled" class="w-6 h-6" />
                            </button>
                        </Tooltip>
                    </PopoverButton>
                    <Transition enter-active-class="transition ease-out"
                        enter-from-class="transform scale-90 opacity-0" 
                        enter-to-class="transform scale-100 opacity-100"
                        leave-active-class="transition ease-in"
                        leave-from-class="transform scale-100 opacity-100" 
                        leave-to-class="transform scale-90 opacity-0">
                        <PopoverPanel class="absolute z-10 transform -translate-x-1/2 left-1/2">
                            <div class="flex gap-2 p-2 shadow-xl rounded-xl bg-base-300">
                                <Tooltip content="Alphabetical">
                                    <label class="btn btn-sm btn-ghost btn-square swap"
                                        :class="{ '!btn-primary': sortings.alphabet != Order.None }" aria-label="Alphabetical">
                                        <input type="checkbox" class="modal-toggle" :checked="sortings.alphabet != Order.None"
                                            @click="updateAlphabeticalOrder" />
                                        <Icon icon="fluent:text-sort-ascending-16-filled" class="w-6 h-6 swap-on" />
                                        <Icon icon="fluent:text-sort-descending-16-filled" class="w-6 h-6 swap-off" />
                                    </label>
                                </Tooltip>
                                <ListHandler tooltip="By Status" icon="ph:spinner-bold" handler="sortings" category="status"
                                :values="[
                                    { value: 'Not Started', icon: 'fluent:record-stop-12-filled' },
                                    { value: 'Dropped', icon: 'fluent:drop-12-filled' },
                                    { value: 'Paused', icon: 'fluent:pause-12-filled' },
                                    { value: 'Completed', icon: 'fluent:checkmark-circle-12-filled' }
                                ]" />
                                <ListHandler tooltip="By Platform" icon="fluent:laptop-16-regular" handler="sortings" category="platform"
                                :values="[
                                    { value: 'PC', icon: 'ri:windows-fill' },
                                    { value: 'Nintendo Switch', icon: 'ri:switch-fill' },
                                    { value: 'Xbox', icon: 'ri:xbox-fill' },
                                    { value: 'PlayStation', icon: 'ri:playstation-fill' }
                                ]" />
                            </div>
                        </PopoverPanel>
                    </Transition>
                </Popover>
                <Popover v-slot="{ open }" class="relative">
                    <PopoverButton as="template">
                        <Tooltip content="Filters" :disable="open">
                            <button class="btn btn-sm btn-ghost btn-square text-base-100" 
                                aria-label="Filters" @click="showStatus = showPlatform = false">
                                <Icon icon="fluent:filter-24-filled" class="w-6 h-6" />
                            </button>
                        </Tooltip>
                    </PopoverButton>
                    <Transition enter-active-class="transition ease-out"
                        enter-from-class="transform scale-90 opacity-0" 
                        enter-to-class="transform scale-100 opacity-100"
                        leave-active-class="transition ease-in"
                        leave-from-class="transform scale-100 opacity-100" 
                        leave-to-class="transform scale-90 opacity-0">
                        <PopoverPanel class="absolute z-10 transform -translate-x-1/2 left-1/2">
                            <div class="flex gap-2 p-2 shadow-xl rounded-xl bg-base-300">
                                <ListHandler tooltip="By Status" icon="ph:spinner-bold" handler="filters" category="status"
                                :values="[
                                    { value: 'Not Started', icon: 'fluent:record-stop-12-filled' },
                                    { value: 'Dropped', icon: 'fluent:drop-12-filled' },
                                    { value: 'Paused', icon: 'fluent:pause-12-filled' },
                                    { value: 'Completed', icon: 'fluent:checkmark-circle-12-filled' }
                                ]" />
                                <ListHandler tooltip="By Platform" icon="fluent:laptop-16-regular" handler="filters" category="platform"
                                :values="[
                                    { value: 'PC', icon: 'ri:windows-fill' },
                                    { value: 'Nintendo Switch', icon: 'ri:switch-fill' },
                                    { value: 'Xbox', icon: 'ri:xbox-fill' },
                                    { value: 'PlayStation', icon: 'ri:playstation-fill' }
                                ]" />
                            </div>
                        </PopoverPanel>
                    </Transition>
                </Popover>
                <div class="mx-0 before:rounded-t-xl after:rounded-b-xl divider divider-horizontal after:bg-base-100/25 before:bg-base-100/25"></div>
                <Tooltip content="Grid View">
                    <button
                        class="btn btn-sm btn-ghost btn-square text-base-100 disabled:text-base-100 disabled:bg-primary-focus"
                        :disabled="viewMode == ViewMode.Grid" @click="header.changeViewMode(ViewMode.Grid)"
                        aria-label="Grid View">
                        <Icon icon="fluent:grid-24-filled" class="w-6 h-6" />
                    </button>
                </Tooltip>
                <Tooltip content="Detail List View">
                    <button
                        class="btn btn-sm btn-ghost btn-square text-base-100 disabled:text-base-100 disabled:bg-primary-focus"
                        :disabled="viewMode == ViewMode.Detail" @click="header.changeViewMode(ViewMode.Detail)"
                        aria-label="Detail List View">
                        <Icon icon="fluent:apps-list-detail-24-filled" class="w-6 h-6" />
                    </button>
                </Tooltip>
                <Tooltip content="Compact List View">
                    <button
                        class="btn btn-sm btn-ghost btn-square text-base-100 disabled:text-base-100 disabled:bg-primary-focus"
                        :disabled="viewMode == ViewMode.Compact" @click="header.changeViewMode(ViewMode.Compact)"
                        aria-label="Compact List View">
                        <Icon icon="fluent:text-bullet-list-ltr-24-filled" class="w-6 h-6" />
                    </button>
                </Tooltip>
            </div>
        </div>
    </div>
</template>