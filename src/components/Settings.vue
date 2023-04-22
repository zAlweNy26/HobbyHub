<script setup lang="ts">
import { Listbox, ListboxButton, ListboxOptions, ListboxOption, ListboxLabel } from '@headlessui/vue'
import _ from 'lodash'
import { Icon } from '@iconify/vue'
import { useSettingsStore } from '@stores/settingsStore'
import { usePageStore } from '@stores/pageStore'
import Modal from '@components/Modal.vue'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import dayjs from 'dayjs'

const locales = {
	de: () => import('dayjs/locale/de'),
	en: () => import('dayjs/locale/en'),
	it: () => import('dayjs/locale/it'),
	es: () => import('dayjs/locale/es'),
	fr: () => import('dayjs/locale/fr'),
}

const i18n = useI18n({ useScope: 'global' })

const page = usePageStore()
const { currentSection } = storeToRefs(page)
const settings = useSettingsStore()
const settingsState = ref(_.cloneDeep(settings.$state))
const modalSettings = ref<InstanceType<typeof Modal>>()
const enableApply = ref(false)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type SupportedLocale = keyof typeof settings.supportedLocales

watch(settingsState, () => enableApply.value = !_.isEqual(settingsState.value, settings.$state), { deep: true })

const openSettings = () => {
	settingsState.value = _.cloneDeep(settings.$state)
	modalSettings.value?.openModal()
	enableApply.value = false
}

const applyChanges = () => {
	settings.$state = settingsState.value
	i18n.locale.value = settingsState.value.currentLanguage
	const dateLocale = settingsState.value.currentLanguage.split("-")[0] as keyof typeof locales
	locales[dateLocale]().then(() => dayjs.locale(dateLocale))
	enableApply.value = false
}

const importDb = async () => {
	const file = await window.electron.importDB()
	if (file) {
		currentSection.value = file.current
		file.sections.forEach(s => page.addSection(s.name, s.cards, s.categories))
		window.electron.saveDB(page.getJsonDB())
		modalSettings.value?.closeModal()
	}
}

const exportDb = () => {
	window.electron.saveDB(page.getJsonDB()).then(() => window.electron.exportDB())
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
					{{ $t("settings.title") }}
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
							{{ $t("settings.language") }} :
						</ListboxLabel>
						<ListboxButton class="flex items-center gap-2 px-2 py-1 mt-1 text-sm border-2 rounded-lg shadow-lg cursor-pointer border-neutral bg-base-300">
							<Icon icon="fluent:local-language-16-filled" class="w-4 h-4 shrink-0" />
							<p>{{ settingsState.currentLanguage }}</p>
							<Icon icon="fluent:chevron-up-down-16-filled" class="w-4 h-4 shrink-0" />
						</ListboxButton>
						<Transition leave-active-class="transition ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
							<ListboxOptions
								class="absolute w-full mt-2 overflow-hidden text-sm rounded-lg shadow-lg cursor-pointer bg-base-300">
								<ListboxOption v-for="lang in $i18n.availableLocales" 
									v-slot="{ active, selected }" :key="lang" :value="lang" as="template">
									<li :class="{ 'bg-primary text-base-100': active, 'bg-secondary text-base-100 font-bold': selected }"
										class="flex items-center gap-2 px-2 py-1 font-medium transition-colors">
										<p class="truncate">
											{{ settings.supportedLocales[lang as SupportedLocale] }}
										</p>
									</li>
								</ListboxOption>
							</ListboxOptions>
						</Transition>
					</div>
				</Listbox>
				<div class="flex flex-col gap-1">
					<p class="text-sm">
						{{ $t("settings.data") }} :
					</p>
					<div class="flex gap-2">
						<button class="font-semibold capitalize btn btn-sm text-neutral btn-ghost !border-primary !border-2" @click="importDb">
							{{ $t("settings.import") }}
						</button>
						<button class="font-semibold capitalize btn btn-sm btn-primary" @click="exportDb">
							{{ $t("settings.export") }}
						</button>
					</div>
				</div>
			</div>
			<button type="button" class="self-center gap-2 px-2 font-bold normal-case btn-info btn-sm btn"
				:disabled="!enableApply" @click="applyChanges">
				<p>{{ $t("settings.apply") }}</p>
				<Icon icon="fluent:checkmark-12-filled" class="w-6 h-6" />
			</button>
		</div>
	</Modal>
</template>