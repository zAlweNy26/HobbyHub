<script setup lang="ts">
import { Listbox, ListboxButton, ListboxOptions, ListboxOption, ListboxLabel } from '@headlessui/vue'
import _ from 'lodash'
import { Icon } from '@iconify/vue'
import { useSettingsStore } from '@stores/settingsStore'
import Modal from '@components/Modal.vue'
import { ref, watch } from 'vue'

const settings = useSettingsStore()
const settingsState = ref(_.cloneDeep(settings.$state))
const modalSettings = ref<InstanceType<typeof Modal>>()
const enableApply = ref(false)

watch(settingsState, () => {
	if (!_.isEqual(settingsState.value, settings.$state)) {
		enableApply.value = true
	}
}, { deep: true })

const openSettings = () => {
	settingsState.value = _.cloneDeep(settings.$state)
	modalSettings.value?.openModal()
	enableApply.value = false
}

const applyChanges = () => {
	settings.$state = settingsState.value
	enableApply.value = false
}

const importDb = (e: Event) => {
	const fileInput = e.target as HTMLInputElement
	if (fileInput.files != null) {
		fileInput.files[0].text().then(text => console.log(JSON.parse(text)))
	}
}

const exportDb = () => {
	console.log("export")
}

defineExpose({
    openSettings
})
</script>

<template>
	<Modal ref="modalSettings">
		<div class="flex flex-col gap-4">
			<div class="flex justify-between gap-2">
				<p class="text-2xl font-black text-primary">
					Settings
				</p>
				<button class="btn-ghost btn-square btn-xs btn hover:bg-error hover:text-base-100"
					@click="modalSettings?.closeModal()">
					<Icon icon="fluent:dismiss-16-filled" class="w-4 h-4" />
				</button>
			</div>
			<div class="flex items-end gap-4">
				<Listbox v-model="settingsState.currentLanguage">
					<div class="relative">
						<ListboxLabel class="text-sm">
							Language :
						</ListboxLabel>
						<ListboxButton class="flex items-center gap-2 px-2 py-1 mt-1 text-sm border-2 rounded-lg shadow-lg cursor-pointer border-neutral bg-base-300">
							<Icon icon="fluent:local-language-16-filled" class="w-4 h-4 shrink-0" />
							<p>{{ settingsState.currentLanguage }}</p>
							<Icon icon="fluent:chevron-up-down-16-filled" class="w-4 h-4 shrink-0" />
						</ListboxButton>
						<Transition leave-active-class="transition ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
							<ListboxOptions
								class="absolute w-full mt-2 overflow-hidden text-sm rounded-lg shadow-lg cursor-pointer bg-base-300">
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
				<div class="flex gap-2">
					<label for="importDb" class="!border-2 btn btn-sm btn-ghost !border-primary">
						<p class="font-semibold capitalize text-neutral">Import</p>
						<input id="importDb" ref="importInput" type="file" class="sr-only" accept="application/json" @change="importDb">
					</label>
					<button class="font-semibold capitalize btn btn-sm btn-primary" @click="exportDb">
						Export
					</button>
				</div>
			</div>
			<button type="button" class="self-center gap-2 px-2 font-bold normal-case btn-info btn-sm btn"
				:disabled="!enableApply" @click="applyChanges">
				<p>Apply</p>
				<Icon icon="fluent:checkmark-12-filled" class="w-6 h-6" />
			</button>
		</div>
	</Modal>
</template>