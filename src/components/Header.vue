<script setup lang="ts">
import { 
	Popover, PopoverButton, PopoverPanel, Dialog, DialogPanel, TransitionChild,
	Listbox, ListboxButton, ListboxOptions, ListboxOption, ListboxLabel, TransitionRoot
} from '@headlessui/vue'
import { Icon } from '@iconify/vue'
import Tooltip from '@components/Tooltip.vue'
import ListHandler from '@components/ListHandler.vue'
import _ from 'lodash'
import { usePageStore } from '@stores/pageStore'
import { useSettingsStore } from '@stores/settingsStore'
import { ViewMode, Order } from '@/interfaces'
import { storeToRefs } from 'pinia'
import Modal from '@components/Modal.vue'
import { ref, watch } from 'vue'
import ThemeButton from '@components/ThemeButton.vue'

const page = usePageStore()
const settings = useSettingsStore()
const { currentSection, viewMode, sortings, sectionsList, categories } = storeToRefs(page)
const settingsState = ref(_.cloneDeep(settings.$state))

const searchItem = ref("")
const zoom = ref(100)
const showStatus = ref(false), showPlatform = ref(false)
const showSide = ref(false), enableApply = ref(false)
const modalSettings = ref<InstanceType<typeof Modal>>()

watch(settingsState, () => {
	if (!_.isEqual(settingsState.value, settings.$state)) {
		enableApply.value = true
	}
}, { deep: true })

window.electron.getProperties().then(p => zoom.value = p.zoom * 100)

const updateZoom = (perc: number) => {
    zoom.value = Math.max(10, Math.min(200, zoom.value += perc))
    window.electron.setZoom(zoom.value)
}

const updateName = (event: FocusEvent) => {
    const target = event.target as HTMLElement
    page.updateSection(currentSection.value, target.innerText.trim())
}

const changeSection = (section: number) => {
    currentSection.value = section
    showSide.value = false
}

const openSettings = () => {
	showSide.value = false
	settingsState.value = _.cloneDeep(settings.$state)
	modalSettings.value?.openCard()
	enableApply.value = false
}

const searchForItem = () => {
	console.log("search")
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

const applyChanges = () => {
	settings.$state = settingsState.value
	enableApply.value = false
}
</script>

<template>
	<div class="navbar min-h-0 shrink-0 justify-between gap-2 bg-primary">
		<div class="navbar-start w-[45%] gap-2">
			<Tooltip content="Menu">
				<button class="btn-ghost btn-square btn-sm btn text-base-100" aria-label="Menu"
					@click="showSide = true">
					<Icon icon="fluent:navigation-24-filled" class="h-6 w-6" />
				</button>
			</Tooltip>
			<span class="max-w-[75%] overflow-hidden whitespace-nowrap font-bold text-base-100" contenteditable="true" @focusout="updateName"
				@keypress="blurOnEnter">{{ sectionsList[currentSection] }}</span>
		</div>
		<div class="navbar-end gap-2">
			<div
				class="flex shrink-0 select-none items-center justify-center gap-2 overflow-hidden rounded-full p-0.5 outline outline-2 outline-base-100">
				<Tooltip content="Zoom out">
					<button class="btn-ghost btn-xs btn-circle btn text-base-100" aria-label="Zoom out"
						@click="updateZoom(-10)">
						<Icon icon="fluent:zoom-out-24-filled" class="h-6 w-6" />
					</button>
				</Tooltip>
				<span class="text-xs font-bold text-base-100">{{ Math.round(zoom) }}%</span>
				<Tooltip content="Zoom in">
					<button class="btn-ghost btn-xs btn-circle btn text-base-100" aria-label="Zoom in"
						@click="updateZoom(10)">
						<Icon icon="fluent:zoom-in-24-filled" class="h-6 w-6" />
					</button>
				</Tooltip>
			</div>
			<div
				class="divider divider-horizontal mx-0 before:rounded-t-xl before:bg-base-100/25 after:rounded-b-xl after:bg-base-100/25" />
			<Popover v-slot="{ open }" class="relative inline-flex">
				<PopoverButton as="template">
					<Tooltip content="Sorting" :disable="open">
						<button class="btn-ghost btn-sm btn-square btn text-base-100" aria-label="Sorting"
							@click="showStatus = showPlatform = false">
							<Icon icon="fluent:arrow-sort-down-lines-24-filled" class="h-6 w-6" />
						</button>
					</Tooltip>
				</PopoverButton>
				<Transition enter-active-class="transition ease-out" enter-from-class="transform scale-90 opacity-0"
					enter-to-class="transform scale-100 opacity-100" leave-active-class="transition ease-in"
					leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-90 opacity-0">
					<PopoverPanel class="absolute left-1/2 z-10 -translate-x-1/2 translate-y-3/4">
						<div class="flex gap-2 rounded-xl bg-base-300 p-2 shadow-xl">
							<Tooltip content="Alphabetical">
								<label class="swap btn-ghost btn-sm btn-square btn"
									:class="{ '!btn-primary': sortings.alphabet != Order.None }"
									aria-label="Alphabetical">
									<input type="checkbox" class="modal-toggle"
										:checked="sortings.alphabet != Order.None" @click="updateAlphabeticalOrder">
									<Icon icon="fluent:text-sort-ascending-16-filled" class="swap-on h-6 w-6" />
									<Icon icon="fluent:text-sort-descending-16-filled" class="swap-off h-6 w-6" />
								</label>
							</Tooltip>
							<ListHandler v-for="cat in categories" :key="cat.name" :tooltip="`By ${cat.name}`" :icon="cat.icon" 
								handler="sortings" :category="cat.name.toLowerCase()" :values="cat.options" />
						</div>
					</PopoverPanel>
				</Transition>
			</Popover>
			<Popover v-slot="{ open }" class="relative inline-flex">
				<PopoverButton as="template">
					<Tooltip content="Filters" :disable="open">
						<button class="btn-ghost btn-sm btn-square btn text-base-100" aria-label="Filters"
							@click="showStatus = showPlatform = false">
							<Icon icon="fluent:filter-24-filled" class="h-6 w-6" />
						</button>
					</Tooltip>
				</PopoverButton>
				<Transition enter-active-class="transition ease-out" enter-from-class="transform scale-90 opacity-0"
					enter-to-class="transform scale-100 opacity-100" leave-active-class="transition ease-in"
					leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-90 opacity-0">
					<PopoverPanel class="absolute left-1/2 z-10 -translate-x-1/2 translate-y-3/4">
						<div class="flex gap-2 rounded-xl bg-base-300 p-2 shadow-xl">
							<ListHandler v-for="cat in categories" :key="cat.name" :tooltip="`By ${cat.name}`" :icon="cat.icon" 
								handler="filters" :category="cat.name.toLowerCase()" :values="cat.options" />
						</div>
					</PopoverPanel>
				</Transition>
			</Popover>
			<div
				class="divider divider-horizontal mx-0 before:rounded-t-xl before:bg-base-100/25 after:rounded-b-xl after:bg-base-100/25" />
			<Tooltip content="Grid View">
				<button
					class="btn-ghost btn-sm btn-square btn text-base-100 disabled:bg-primary-focus disabled:text-base-100"
					:disabled="viewMode == ViewMode.Grid" aria-label="Grid View"
					@click="page.changeViewMode(ViewMode.Grid)">
					<Icon icon="fluent:grid-24-filled" class="h-6 w-6" />
				</button>
			</Tooltip>
			<Tooltip content="Detail List View">
				<button
					class="btn-ghost btn-sm btn-square btn text-base-100 disabled:bg-primary-focus disabled:text-base-100"
					:disabled="viewMode == ViewMode.Detail" aria-label="Detail List View"
					@click="page.changeViewMode(ViewMode.Detail)">
					<Icon icon="fluent:apps-list-detail-24-filled" class="h-6 w-6" />
				</button>
			</Tooltip>
			<Tooltip content="Compact List View">
				<button
					class="btn-ghost btn-sm btn-square btn text-base-100 disabled:bg-primary-focus disabled:text-base-100"
					:disabled="viewMode == ViewMode.Compact" aria-label="Compact List View"
					@click="page.changeViewMode(ViewMode.Compact)">
					<Icon icon="fluent:text-bullet-list-ltr-24-filled" class="h-6 w-6" />
				</button>
			</Tooltip>
		</div>
	</div>
	<TransitionRoot as="template" :show="showSide">
		<Dialog as="div" class="relative z-50" @close="showSide = false">
			<TransitionChild as="template" enter="ease-in-out duration-300" enter-from="opacity-0"
				enter-to="opacity-100" leave="ease-in-out" leave-from="opacity-100" leave-to="opacity-0">
				<div class="fixed inset-0 top-6 bg-base-100/50 transition-opacity" />
			</TransitionChild>
			<div class="fixed inset-0 top-6 overflow-hidden">
				<div class="absolute inset-0 top-6 overflow-hidden">
					<div class="pointer-events-none fixed inset-y-0 left-0 top-6 flex max-w-full">
						<TransitionChild as="template" enter="transform transition ease-in-out duration-300"
							enter-from="-translate-x-full" enter-to="translate-x-0"
							leave="transform transition ease-in-out duration-300" leave-from="translate-x-0"
							leave-to="-translate-x-full">
							<DialogPanel class="pointer-events-auto relative w-screen max-w-fit">
								<div class="flex h-full max-w-[15rem] flex-col gap-2 overflow-y-auto bg-base-300 p-2 shadow-xl">
									<div class="flex items-center justify-between gap-4 overflow-hidden">
										<ThemeButton />
										<button class="btn-ghost btn-sm btn gap-2 px-1" aria-label="Open Settings" @click="openSettings">
											<Icon icon="fluent:settings-24-filled" class="h-6 w-6" />
											<p class="text-sm capitalize">
												Settings
											</p>
										</button>
										<!--<Tooltip content="Close Menu"> Problem with Transition components -->
										<button class="btn-ghost btn-sm btn-square btn" aria-label="Close Menu"
											@click="showSide = false">
											<Icon icon="fluent:dismiss-24-filled" class="h-6 w-6" />
										</button>
										<!--</Tooltip>-->
									</div>
									<div class="input-group-bordered my-4">
										<button class="btn-primary btn-sm btn-square btn" aria-label="Search an item" @click="searchForItem">
											<Icon class="h-6 w-6" icon="fluent:search-24-filled" />
										</button>
										<input v-model="searchItem" type="text" class="input !input-sm w-full" placeholder="Enter an item..." @keyup.enter="searchForItem">
									</div>
									<button aria-label="Add" class="btn-primary btn-sm btn mb-4 gap-2 px-1">
										<Icon class="h-6 w-6 shrink-0" icon="fluent:add-24-filled" />
										<p class="font-extrabold">
											Add
										</p>
									</button>
									<button v-for="(section, index) in sectionsList" :key="section" :aria-label="section"
										class="btn-ghost btn-sm btn flex-nowrap justify-start gap-2 px-1" @click="changeSection(index)">
										<Icon class="h-6 w-6 shrink-0" icon="fluent:archive-24-filled" />
										<p class="truncate normal-case">
											{{ section }}
										</p>
									</button>
								</div>
							</DialogPanel>
						</TransitionChild>
					</div>
				</div>
			</div>
		</Dialog>
	</TransitionRoot>
	<Modal ref="modalSettings">
		<div class="flex flex-col gap-2">
			<div class="flex justify-between gap-2">
				<p class="text-2xl font-black text-primary">
					Settings
				</p>
				<button class="btn-ghost btn-xs btn-square btn hover:bg-error hover:text-base-100"
					@click="modalSettings?.closeCard()">
					<Icon icon="fluent:dismiss-16-filled" class="h-4 w-4" />
				</button>
			</div>
			<div class="flex items-center gap-4">
				<Listbox v-model="settingsState.currentLanguage">
					<div class="relative">
						<ListboxLabel class="text-sm">
							Language :
						</ListboxLabel>
						<ListboxButton class="mt-1 flex cursor-pointer items-center gap-2 rounded-lg border-2 border-neutral bg-base-300 px-2 py-1 text-sm shadow-lg">
							<Icon icon="fluent:local-language-16-filled" class="h-4 w-4 shrink-0" />
							<p>{{ settingsState.currentLanguage }}</p>
							<Icon icon="fluent:chevron-up-down-16-filled" class="h-4 w-4 shrink-0" />
						</ListboxButton>
						<Transition leave-active-class="transition ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
							<ListboxOptions
								class="absolute mt-2 w-full cursor-pointer overflow-hidden rounded-lg bg-base-300 text-sm shadow-lg">
								<ListboxOption v-for="lang in settings.languagesList" v-slot="{ active, selected }" :key="lang" :value="lang" as="template">
									<li :class="{ 'bg-primary text-base-100': active, 'bg-secondary text-base-100 font-bold': selected }"
										class="flex items-center gap-2 px-2 py-1 font-medium transition-colors">
										<p class="truncate">
											{{ lang }}
										</p>
									</li>
								</ListboxOption>
							</ListboxOptions>
						</Transition>
					</div>
				</Listbox>
			</div>
			<button type="button" class="btn-info btn-sm btn gap-2 self-center px-2 font-bold normal-case"
				:disabled="!enableApply" @click="applyChanges">
				<p>Apply</p>
				<Icon icon="fluent:checkmark-12-filled" class="h-6 w-6" />
			</button>
		</div>
	</Modal>
</template>