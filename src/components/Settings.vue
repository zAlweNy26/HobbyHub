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

defineExpose({
    openSettings
})
</script>

<template>
	<Modal ref="modalSettings">
		<div class="flex flex-col gap-2">
			<div class="flex justify-between gap-2">
				<p class="text-2xl font-black text-primary">
					Settings
				</p>
				<button class="btn-ghost btn-square btn-xs btn hover:bg-error hover:text-base-100"
					@click="modalSettings?.closeModal()">
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