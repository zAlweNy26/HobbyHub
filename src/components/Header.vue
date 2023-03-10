<script setup lang="ts">
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import { Icon } from '@iconify/vue'
import Tooltip from '@components/Tooltip.vue'
import ListHandler from '@components/ListHandler.vue'
import { usePageStore } from '@stores/pageStore'
import { ViewMode, Order } from '@/interfaces'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import SideBar from '@components/SideBar.vue'

const page = usePageStore()
const { currentSection, viewMode, sortings, sectionsList, categories } = storeToRefs(page)

const zoom = ref(100)
const sideBarComp = ref<InstanceType<typeof SideBar>>()

window.electron.getProperties().then(p => zoom.value = p.zoom * 100)

const updateZoom = (perc: number) => {
    zoom.value = Math.max(10, Math.min(200, zoom.value += perc))
    window.electron.setZoom(zoom.value)
}

const updateName = (event: FocusEvent) => {
    const target = event.target as HTMLElement
	target.innerText = target.innerText.trim() || "Template"
    page.updateSection(currentSection.value, target.innerText)
}

const blurOnEnter = (event: KeyboardEvent) => {
    const target = event.target as HTMLElement
    if (event.key == "Enter") target.blur()
}

const updateAlphabeticalOrder = () => {
    if (sortings.value[currentSection.value].alphabet == Order.Ascending) sortings.value[currentSection.value].alphabet = Order.Descending
    else if (sortings.value[currentSection.value].alphabet == Order.Descending) sortings.value[currentSection.value].alphabet = Order.None
    else sortings.value[currentSection.value].alphabet = Order.Ascending
}
</script>

<template>
	<div class="justify-between min-h-0 gap-2 navbar shrink-0 bg-primary">
		<div class="w-full gap-2 overflow-hidden navbar-start">
			<Tooltip content="Menu">
				<button class="btn-ghost btn-square btn-sm btn text-base-100" aria-label="Menu" @click="sideBarComp!.isOpen = true">
					<Icon icon="fluent:navigation-24-filled" class="w-6 h-6" />
				</button>
			</Tooltip>
			<span class="overflow-hidden font-bold whitespace-nowrap text-base-100" contenteditable="true" 
				@focusout="updateName" @keypress="blurOnEnter">{{ sectionsList[currentSection] }}</span>
		</div>
		<div class="gap-2 navbar-end w-min">
			<div class="flex shrink-0 select-none items-center justify-center gap-2 overflow-hidden rounded-full p-0.5 outline outline-2 outline-base-100">
				<Tooltip content="Zoom out">
					<button class="btn-ghost btn-xs btn-circle btn text-base-100" aria-label="Zoom out"
						@click="updateZoom(-10)">
						<Icon icon="fluent:zoom-out-24-filled" class="w-6 h-6" />
					</button>
				</Tooltip>
				<span class="text-xs font-bold text-base-100">{{ Math.round(zoom) }}%</span>
				<Tooltip content="Zoom in">
					<button class="btn-ghost btn-xs btn-circle btn text-base-100" aria-label="Zoom in"
						@click="updateZoom(10)">
						<Icon icon="fluent:zoom-in-24-filled" class="w-6 h-6" />
					</button>
				</Tooltip>
			</div>
			<div class="divider divider-horizontal" />
			<Popover v-slot="{ open }" class="relative inline-flex">
				<PopoverButton as="template">
					<Tooltip content="Sorting" :disable="open">
						<button class="btn-ghost btn-sm btn-square btn text-base-100" aria-label="Sorting">
							<Icon icon="fluent:arrow-sort-down-lines-24-filled" class="w-6 h-6" />
						</button>
					</Tooltip>
				</PopoverButton>
				<Transition enter-active-class="transition ease-out" enter-from-class="transform scale-90 opacity-0"
					enter-to-class="transform scale-100 opacity-100" leave-active-class="transition ease-in"
					leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-90 opacity-0">
					<PopoverPanel class="absolute z-10 -translate-x-1/2 left-1/2 translate-y-3/4">
						<div class="flex gap-2 p-2 shadow-xl rounded-xl bg-base-300">
							<Tooltip content="Alphabetical">
								<label class="swap btn-ghost btn-sm btn-square btn"
									:class="{ '!btn-primary': sortings[currentSection].alphabet != Order.None }"
									aria-label="Alphabetical">
									<input type="checkbox" class="modal-toggle"
										:checked="sortings[currentSection].alphabet != Order.None" @click="updateAlphabeticalOrder">
									<Icon icon="fluent:text-sort-ascending-16-filled" class="w-6 h-6 swap-on" />
									<Icon icon="fluent:text-sort-descending-16-filled" class="w-6 h-6 swap-off" />
								</label>
							</Tooltip>
							<ListHandler v-for="cat in categories[currentSection]" :key="cat.name" :tooltip="`By ${cat.name}`" :icon="cat.icon" 
								handler="sortings" :category="cat.name.toLowerCase()" :values="cat.options" />
						</div>
					</PopoverPanel>
				</Transition>
			</Popover>
			<Popover v-slot="{ open }" class="relative inline-flex">
				<PopoverButton as="template">
					<Tooltip content="Filters" :disable="open">
						<button class="btn-ghost btn-sm btn-square btn text-base-100" aria-label="Filters">
							<Icon icon="fluent:filter-24-filled" class="w-6 h-6" />
						</button>
					</Tooltip>
				</PopoverButton>
				<Transition enter-active-class="transition ease-out" enter-from-class="transform scale-90 opacity-0"
					enter-to-class="transform scale-100 opacity-100" leave-active-class="transition ease-in"
					leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-90 opacity-0">
					<PopoverPanel v-if="categories[currentSection].length > 0" class="absolute z-10 -translate-x-1/2 left-1/2 translate-y-3/4">
						<div class="flex gap-2 p-2 shadow-xl rounded-xl bg-base-300">
							<ListHandler v-for="cat in categories[currentSection]" :key="cat.name" :tooltip="`By ${cat.name}`" :icon="cat.icon" 
								handler="filters" :category="cat.name.toLowerCase()" :values="cat.options" />
						</div>
					</PopoverPanel>
				</Transition>
			</Popover>
			<div class="divider divider-horizontal" />
			<Tooltip content="Grid View">
				<button
					class="btn-ghost btn-sm btn-square btn text-base-100 disabled:bg-primary-focus disabled:text-base-100"
					:disabled="viewMode == ViewMode.Grid" aria-label="Grid View"
					@click="page.changeViewMode(ViewMode.Grid)">
					<Icon icon="fluent:grid-24-filled" class="w-6 h-6" />
				</button>
			</Tooltip>
			<Tooltip content="Detail List View">
				<button
					class="btn-ghost btn-sm btn-square btn text-base-100 disabled:bg-primary-focus disabled:text-base-100"
					:disabled="viewMode == ViewMode.Detail" aria-label="Detail List View"
					@click="page.changeViewMode(ViewMode.Detail)">
					<Icon icon="fluent:apps-list-detail-24-filled" class="w-6 h-6" />
				</button>
			</Tooltip>
			<Tooltip content="Compact List View">
				<button
					class="btn-ghost btn-sm btn-square btn text-base-100 disabled:bg-primary-focus disabled:text-base-100"
					:disabled="viewMode == ViewMode.Compact" aria-label="Compact List View"
					@click="page.changeViewMode(ViewMode.Compact)">
					<Icon icon="fluent:text-bullet-list-ltr-24-filled" class="w-6 h-6" />
				</button>
			</Tooltip>
		</div>
	</div>
	<SideBar ref="sideBarComp" />
</template>