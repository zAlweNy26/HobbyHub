<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ref } from 'vue'
import Tooltip from '@components/Tooltip.vue'
import { useHeaderStore } from '@stores/headerStore'
import { ViewMode } from '@/interfaces'
import { storeToRefs } from 'pinia'

const header = useHeaderStore()
const { currentSection } = storeToRefs(header)

const updateZoom = (perc: number) => {
    header.updateZoom(perc)
    window.electron.setZoom(header.zoom)
}

const updateName = (event: Event) => {
    const target = event.target as HTMLSpanElement
    currentSection.value = target.innerText
}

const hasFilters = ref(false)
</script>

<template>
    <div class="min-h-0 navbar p-1.5 bg-primary">
        <div class="gap-2 navbar-start">
            <Tooltip content="Menu">
                <label class="btn btn-sm btn-ghost btn-square text-base-100 swap swap-rotate" aria-label="Menu">
                    <input type="checkbox" class="modal-toggle" />
                    <Icon icon="fluent:navigation-24-filled" class="w-6 h-6 swap-off" />
                    <Icon icon="fluent:dismiss-24-filled" class="w-6 h-6 swap-on" />
                </label>
            </Tooltip>
            <span class="font-semibold text-base-100 max-w-1/2" contenteditable="true" @change="updateName">{{ currentSection }}</span>
        </div>
        <div class="flex gap-2 navbar-end">
            <div class="flex items-center shrink-0 justify-center gap-1 p-0.5 overflow-hidden rounded-full select-none outline-2 outline outline-base-100">
                <Tooltip content="Zoom out">
                    <button class="btn btn-xs btn-ghost btn-circle text-base-100" aria-label="Zoom out" @click="updateZoom(-10)">
                        <Icon icon="fluent:zoom-out-24-filled" class="w-6 h-6" />
                    </button>
                </Tooltip>
                <span class="text-xs font-semibold text-base-100">{{ header.zoom }}%</span>
                <Tooltip content="Zoom in">
                    <button class="btn btn-xs btn-ghost btn-circle text-base-100" aria-label="Zoom in" @click="updateZoom(10)">
                        <Icon icon="fluent:zoom-in-24-filled" class="w-6 h-6" />
                    </button>
                </Tooltip>
            </div>
            <Tooltip content="Filters">
                <label class="btn btn-sm btn-ghost btn-square text-base-100 swap" aria-label="Filters">
                    <input type="checkbox" class="modal-toggle" :checked="hasFilters" @click="hasFilters = !hasFilters" />
                    <Icon icon="fluent:filter-24-filled" class="w-6 h-6 swap-off" />
                    <Icon icon="fluent:filter-dismiss-24-filled" class="w-6 h-6 swap-on" />
                </label>
            </Tooltip>
            <div class="mx-0 before:rounded-t-xl after:rounded-b-xl divider divider-horizontal after:bg-base-100/25 before:bg-base-100/25"></div>
            <Tooltip content="Grid View">
                <button
                    class="btn btn-sm btn-ghost btn-square text-base-100 disabled:text-base-100 disabled:bg-primary-focus"
                    :disabled="header.viewMode == ViewMode.Grid" @click="header.changeViewMode(ViewMode.Grid)" aria-label="Grid View">
                    <Icon icon="fluent:grid-24-filled" class="w-6 h-6" />
                </button>
            </Tooltip>
            <Tooltip content="Detail List View">
                <button
                    class="btn btn-sm btn-ghost btn-square text-base-100 disabled:text-base-100 disabled:bg-primary-focus"
                    :disabled="header.viewMode == ViewMode.Detail" @click="header.changeViewMode(ViewMode.Detail)" aria-label="Detail List View">
                    <Icon icon="fluent:apps-list-detail-24-filled" class="w-6 h-6" />
                </button>
            </Tooltip>
            <Tooltip content="Compact List View">
                <button class="btn btn-sm btn-ghost btn-square text-base-100 disabled:text-base-100 disabled:bg-primary-focus"
                    :disabled="header.viewMode == ViewMode.Compact" @click="header.changeViewMode(ViewMode.Compact)" aria-label="Compact List View">
                    <Icon icon="fluent:text-bullet-list-ltr-24-filled" class="w-6 h-6" />
                </button>
            </Tooltip>
        </div>
    </div>
</template>