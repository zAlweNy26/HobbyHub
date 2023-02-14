<script setup lang="ts">
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { Icon } from '@iconify/vue'
import ThemeButton from '@components/ThemeButton.vue'
import { usePageStore } from '@stores/pageStore'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import Settings from '@components/Settings.vue'

const page = usePageStore()
const { sectionsList, currentSection } = storeToRefs(page)

const isOpen = ref(false)
const searchItem = ref("")
const settingsComp = ref<InstanceType<typeof Settings>>()

const openSettings = () => {
	isOpen.value = false
	settingsComp.value?.openSettings()
}

const searchForItem = () => {
	console.log("search")
}

const changeSection = (section: number) => {
    currentSection.value = section
    isOpen.value = false
}

defineExpose({
    isOpen
})
</script>

<template>
	<TransitionRoot as="template" :show="isOpen">
		<Dialog as="div" class="relative z-50" @close="isOpen = false">
			<TransitionChild as="template" enter="ease-in-out duration-300" enter-from="opacity-0"
				enter-to="opacity-100" leave="ease-in-out" leave-from="opacity-100" leave-to="opacity-0">
				<div class="fixed inset-0 transition-opacity top-6 bg-base-100/50" />
			</TransitionChild>
			<div class="fixed inset-0 overflow-hidden top-6">
				<div class="absolute inset-0 overflow-hidden top-6">
					<div class="fixed inset-y-0 left-0 flex max-w-full pointer-events-none top-6">
						<TransitionChild as="template" enter="transform transition ease-in-out duration-300"
							enter-from="-translate-x-full" enter-to="translate-x-0"
							leave="transform transition ease-in-out duration-300" leave-from="translate-x-0"
							leave-to="-translate-x-full">
							<DialogPanel class="relative w-screen pointer-events-auto max-w-fit">
								<div class="flex flex-col h-full max-w-[16rem] gap-2 p-2 shadow-xl bg-base-300">
									<div class="flex items-center justify-between gap-4">
										<button class="gap-2 px-1 btn-ghost btn-sm btn" aria-label="Open Settings" @click="openSettings">
											<Icon icon="fluent:settings-24-filled" class="w-6 h-6" />
										</button>
										<ThemeButton />
										<!--<Tooltip content="Close Menu"> Problem with Transition components -->
										<button class="btn-ghost btn-square btn-sm btn" aria-label="Close Menu" @click="isOpen = false">
											<Icon icon="fluent:dismiss-24-filled" class="w-6 h-6" />
										</button>
										<!--</Tooltip>-->
									</div>
									<div class="h-10 my-4 input-group-bordered">
										<input v-model="searchItem" type="text" class="input !input-sm w-full" placeholder="Enter an item..." @keyup.enter="searchForItem">
										<button class="btn-primary btn-square btn-sm btn" aria-label="Search an item" @click="searchForItem">
											<Icon class="w-6 h-6" icon="fluent:search-24-filled" />
										</button>
									</div>
									<button aria-label="Add section" class="gap-2 px-1 btn-primary btn-sm btn" @click="changeSection(page.addSection('Template'))">
										<Icon class="w-6 h-6 shrink-0" icon="fluent:add-24-filled" />
										<p class="font-extrabold">
											Add
										</p>
									</button>
									<div class="flex flex-col gap-2 my-4 overflow-y-auto snap-y" style="direction: rtl;">
										<button v-for="(section, index) in sectionsList" :key="section" :aria-label="section" style="direction: ltr;"
											class="justify-start gap-2 px-1 overflow-y-auto btn-ghost snap-start btn-sm btn flex-nowrap" @click="changeSection(index)">
											<Icon class="w-6 h-6 shrink-0" icon="fluent:archive-24-filled" />
											<p class="normal-case truncate">
												{{ section }}
											</p>
										</button>
									</div>
								</div>
							</DialogPanel>
						</TransitionChild>
					</div>
				</div>
			</div>
		</Dialog>
	</TransitionRoot>
	<Settings ref="settingsComp" />
</template>