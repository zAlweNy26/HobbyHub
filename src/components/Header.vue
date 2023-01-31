<script setup lang="ts">
import { Popover, PopoverButton, PopoverPanel, Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { Icon } from '@iconify/vue'
import Tooltip from '@components/Tooltip.vue'
import ListHandler from '@components/ListHandler.vue'
import { useHeaderStore } from '@stores/headerStore'
import { ViewMode, Order } from '@/interfaces'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

const header = useHeaderStore()
const { currentSection, viewMode, sortings, sectionsList } = storeToRefs(header)

const searchItem = ref("")
const zoom = ref(100)
const showStatus = ref(false), showPlatform = ref(false), showSide = ref(false)

window.electron.getProperties().then(p => zoom.value = p.zoom * 100)

const updateZoom = (perc: number) => {
    zoom.value = Math.max(10, Math.min(200, zoom.value += perc))
    window.electron.setZoom(zoom.value)
}

const updateName = (event: FocusEvent) => {
    const target = event.target as HTMLSpanElement
    header.updateSection(currentSection.value, target.innerText.trim())
}

const changeSection = (section: number) => {
    currentSection.value = section
    showSide.value = false
}

const searchForItem = () => {

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
</script>

<template>
    <div class="justify-between min-h-0 gap-2 navbar bg-primary">
        <div class="gap-2 navbar-start w-[45%]">
            <Tooltip content="Menu">
                <button class="btn btn-sm btn-ghost btn-square text-base-100" @click="showSide = true"
                    aria-label="Menu">
                    <Icon icon="fluent:navigation-24-filled" class="w-6 h-6" />
                </button>
            </Tooltip>
            <span class="overflow-hidden font-bold whitespace-nowrap text-base-100 max-w-[75%]" contenteditable="true" @focusout="updateName"
                @keypress="blurOnEnter">{{ sectionsList[currentSection] }}</span>
        </div>
        <div class="gap-2 navbar-end">
            <div
                class="flex items-center shrink-0 justify-center gap-2 p-0.5 overflow-hidden rounded-full select-none outline-2 outline outline-base-100">
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
            <div
                class="mx-0 before:rounded-t-xl after:rounded-b-xl divider divider-horizontal after:bg-base-100/25 before:bg-base-100/25">
            </div>
            <Popover v-slot="{ open }" class="relative inline-flex">
                <PopoverButton as="template">
                    <Tooltip content="Sorting" :disable="open">
                        <button class="btn btn-sm btn-ghost btn-square text-base-100" aria-label="Sorting"
                            @click="showStatus = showPlatform = false">
                            <Icon icon="fluent:arrow-sort-down-lines-24-filled" class="w-6 h-6" />
                        </button>
                    </Tooltip>
                </PopoverButton>
                <Transition enter-active-class="transition ease-out" enter-from-class="transform scale-90 opacity-0"
                    enter-to-class="transform scale-100 opacity-100" leave-active-class="transition ease-in"
                    leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-90 opacity-0">
                    <PopoverPanel class="absolute z-10 transform -translate-x-1/2 translate-y-3/4 left-1/2">
                        <div class="flex gap-2 p-2 shadow-xl rounded-xl bg-base-300">
                            <Tooltip content="Alphabetical">
                                <label class="btn btn-sm btn-ghost btn-square swap"
                                    :class="{ '!btn-primary': sortings.alphabet != Order.None }"
                                    aria-label="Alphabetical">
                                    <input type="checkbox" class="modal-toggle"
                                        :checked="sortings.alphabet != Order.None" @click="updateAlphabeticalOrder" />
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
                            <ListHandler tooltip="By Platform" icon="fluent:laptop-16-regular" handler="sortings"
                                category="platform" :values="[
                                    { value: 'PC', icon: 'ri:windows-fill' },
                                    { value: 'Nintendo Switch', icon: 'ri:switch-fill' },
                                    { value: 'Xbox', icon: 'ri:xbox-fill' },
                                    { value: 'PlayStation', icon: 'ri:playstation-fill' }
                                ]" />
                        </div>
                    </PopoverPanel>
                </Transition>
            </Popover>
            <Popover v-slot="{ open }" class="relative inline-flex">
                <PopoverButton as="template">
                    <Tooltip content="Filters" :disable="open">
                        <button class="btn btn-sm btn-ghost btn-square text-base-100" aria-label="Filters"
                            @click="showStatus = showPlatform = false">
                            <Icon icon="fluent:filter-24-filled" class="w-6 h-6" />
                        </button>
                    </Tooltip>
                </PopoverButton>
                <Transition enter-active-class="transition ease-out" enter-from-class="transform scale-90 opacity-0"
                    enter-to-class="transform scale-100 opacity-100" leave-active-class="transition ease-in"
                    leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-90 opacity-0">
                    <PopoverPanel class="absolute z-10 transform -translate-x-1/2 translate-y-3/4 left-1/2">
                        <div class="flex gap-2 p-2 shadow-xl rounded-xl bg-base-300">
                            <ListHandler tooltip="By Status" icon="ph:spinner-bold" handler="filters" category="status"
                                :values="[
                                    { value: 'Not Started', icon: 'fluent:record-stop-12-filled' },
                                    { value: 'Dropped', icon: 'fluent:drop-12-filled' },
                                    { value: 'Paused', icon: 'fluent:pause-12-filled' },
                                    { value: 'Completed', icon: 'fluent:checkmark-circle-12-filled' }
                                ]" />
                            <ListHandler tooltip="By Platform" icon="fluent:laptop-16-regular" handler="filters"
                                category="platform" :values="[
                                    { value: 'PC', icon: 'ri:windows-fill' },
                                    { value: 'Nintendo Switch', icon: 'ri:switch-fill' },
                                    { value: 'Xbox', icon: 'ri:xbox-fill' },
                                    { value: 'PlayStation', icon: 'ri:playstation-fill' }
                                ]" />
                        </div>
                    </PopoverPanel>
                </Transition>
            </Popover>
            <div
                class="mx-0 before:rounded-t-xl after:rounded-b-xl divider divider-horizontal after:bg-base-100/25 before:bg-base-100/25">
            </div>
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
    <TransitionRoot as="template" :show="showSide">
        <Dialog as="div" class="relative z-50" @close="showSide = false">
            <TransitionChild as="template" enter="ease-in-out duration-300" enter-from="opacity-0"
                enter-to="opacity-100" leave="ease-in-out" leave-from="opacity-100" leave-to="opacity-0">
                <div class="fixed inset-0 transition-opacity bg-opacity-50 top-6 bg-base-100" />
            </TransitionChild>
            <div class="fixed inset-0 overflow-hidden">
                <div class="absolute inset-0 overflow-hidden">
                    <div class="fixed inset-y-0 left-0 flex max-w-full pointer-events-none top-6">
                        <TransitionChild as="template" enter="transform transition ease-in-out duration-300"
                            enter-from="-translate-x-full" enter-to="translate-x-0"
                            leave="transform transition ease-in-out duration-300" leave-from="translate-x-0"
                            leave-to="-translate-x-full">
                            <DialogPanel class="relative w-screen pointer-events-auto max-w-fit">
                                <div class="flex flex-col h-full max-w-[15rem] gap-2 p-2 overflow-y-auto shadow-xl bg-base-300">
                                    <div class="flex items-center justify-between gap-4 overflow-hidden">
                                        <button class="gap-2 px-1 btn btn-sm btn-ghost" aria-label="Open Settings">
                                            <Icon icon="fluent:settings-24-filled" class="w-6 h-6" />
                                            <p class="text-base capitalize">Settings</p>
                                        </button>
                                        <!--<Tooltip content="Close Menu"> Problem with Transition components -->
                                        <button class="btn btn-sm btn-ghost btn-square" @click="showSide = false"
                                            aria-label="Close Menu">
                                            <Icon icon="fluent:dismiss-24-filled" class="w-6 h-6" />
                                        </button>
                                        <!--</Tooltip>-->
                                    </div>
                                    <div class="my-4 input-group-bordered">
                                        <button class="btn btn-sm btn-square btn-primary" @click="searchForItem" aria-label="Search an item">
                                            <Icon class="w-6 h-6" icon="fluent:search-24-filled" />
                                        </button>
                                        <input v-model="searchItem" type="text" class="input !input-sm w-full" 
                                            placeholder="Enter an item..." @keyup.enter="searchForItem" />
                                    </div>
                                    <button v-for="(section, index) in sectionsList" :key="section" :aria-label="section"
                                        class="justify-start gap-2 px-1 btn flex-nowrap btn-sm btn-ghost" @click="changeSection(index)">
                                        <Icon class="w-6 h-6 shrink-0" icon="fluent:archive-24-filled" />
                                        <p class="normal-case truncate">{{ section }}</p>
                                    </button>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>