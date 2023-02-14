<script setup lang="ts">
import imgTemplate from '@assets/image_template.png'
import { Icon } from '@iconify/vue'
import { ref } from 'vue'
import _ from 'lodash'
import Modal from '@components/Modal.vue'
import type { ICard, ICategory, ITag } from '@/interfaces'
import { ViewMode } from '@/interfaces'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption, ListboxLabel } from '@headlessui/vue'
import { usePageStore } from '@stores/pageStore'
import { storeToRefs } from 'pinia'

const emit = defineEmits(['delete', 'save'])

const page = usePageStore()
const { categories, currentSection } = storeToRefs(page)

const props = defineProps<{
	content: ICard,
	mode: ViewMode,
	index: number
}>()

const baseCard = ref(props.content)
const currentCard = ref<ICard>(_.cloneDeep(baseCard.value))
const modalCard = ref<InstanceType<typeof Modal>>()

const currentCardTag = (cat: ICategory) => {
	const tag = currentCard.value.tags.find(t => t.type == cat.name.toLowerCase())?.value
	return tag ?? ""
}

const tagColors = (cat: string, val: string) => {
	const category = categories.value[currentSection.value].find(c => c.name.toLowerCase() == cat)
	const option = category?.options.find(o => o.value == val)
	return {
		bg: option?.bg ?? "",
		fg: option?.fg ?? ""
	}
}

const currentCardIcon = (cat: ICategory) => {
	const tag = currentCard.value.tags.find(t => t.type == cat.name.toLowerCase())?.value
	const icon = tag ? cat.options.find(o => o.value == tag)?.icon : ""
	return icon ?? ""
}

const saveCard = () => {
	modalCard.value?.closeModal()
	if (props.index == -1) currentCard.value.added = Date.now() / 1000
	if (currentCard.value.image == "") currentCard.value.image = imgTemplate
	currentCard.value.updated = Date.now() / 1000
	emit("save", props.index, _.cloneDeep(currentCard.value))
	if (props.index != -1) baseCard.value = _.cloneDeep(currentCard.value)
}

const blurOnEnter = (event: KeyboardEvent) => {
	const target = event.target as HTMLElement
	if (event.key == "Enter") target.blur()
}

const updateCardName = (event: FocusEvent) => {
	const target = event.target as HTMLHeadingElement
	currentCard.value.name = target.innerText.trim()
}

const openCard = () => {
	currentCard.value = _.cloneDeep(baseCard.value)
	modalCard.value?.openModal()
}

const deleteCard = () => {
	modalCard.value?.closeModal()
	emit("delete", props.index)
}

const compareTags = (a: ITag, b: string) => {
	return a.value == b
}

const updateCardTag = (value: string, type: string) => {
	const tag = currentCard.value.tags.find(t => t.type == type)
	if (tag != undefined) tag.value = value
}
//TODO: Trovare modo di far funzionare i colori importati dal db
</script>

<template>
	<div v-if="mode == ViewMode.Grid && index == -1"
		class="flex items-center justify-center overflow-hidden rounded-lg cursor-pointer h-min w-fit"
		@click="openCard">
		<div
			class="flex items-center justify-center w-40 transition-all duration-200 h-60 bg-base-200 text-neutral hover:scale-110 hover:bg-base-300">
			<Icon icon="fluent:add-16-filled" class="h-14 w-14" />
		</div>
	</div>
	<div v-else-if="mode == ViewMode.Detail && index == -1"
		class="flex items-center justify-center w-full overflow-hidden rounded-lg cursor-pointer h-min text-neutral"
		@click="openCard">
		<div
			class="flex h-[7.5rem] w-full items-center justify-center rounded-lg bg-base-200 transition-all duration-200 hover:scale-110 hover:bg-base-300">
			<Icon icon="fluent:add-16-filled" class="w-12 h-12" />
		</div>
	</div>
	<div v-else-if="mode == ViewMode.Compact && index == -1"
		class="flex items-center justify-center w-full overflow-hidden rounded-lg cursor-pointer h-min text-neutral"
		@click="openCard">
		<div
			class="flex items-center justify-center w-full h-16 transition-all duration-200 rounded-lg bg-base-200 hover:scale-110 hover:bg-base-300">
			<Icon icon="fluent:add-16-filled" class="w-10 h-10" />
		</div>
	</div>
	<div v-else-if="mode == ViewMode.Grid" class="flex flex-col gap-1 cursor-pointer h-min w-fit" @click="openCard">
		<div class="relative inline-block overflow-hidden rounded-lg hover:child-img:scale-110">
			<img class="object-cover object-center w-40 transition-all duration-200 select-none h-60" draggable="false"
				:src="baseCard.image" :alt="baseCard.name">
			<p class="absolute bottom-0 left-0 w-full p-1 font-bold bg-base-100/75 text-neutral">
				{{ baseCard.name }}
			</p>
		</div>
	</div>
	<div v-else-if="mode == ViewMode.Detail"
		class="flex w-full gap-2 p-2 transition-all rounded-lg cursor-pointer h-min hover:bg-base-300"
		@click="openCard">
		<img class="h-[7.5rem] w-20 select-none rounded-md object-cover object-center" draggable="false"
			:src="baseCard.image" :alt="baseCard.name">
		<div class="flex flex-col">
			<p class="font-bold text-neutral">
				{{ baseCard.name }}
			</p>
			<p class="text-xs font-semibold text-neutral">
				Added on {{ new Date(currentCard.added * 1000).toLocaleDateString() }}
			</p>
			<div class="flex items-center gap-2 mt-1">
				<div v-for="tag in baseCard.tags.filter(t => t.value != 'None')" :key="tag.type"
					:class="tagColors(tag.type, tag.value).bg"
					class="flex w-min items-center gap-1 rounded-full px-1.5 py-0.5">
					<p class="text-xs font-bold whitespace-nowrap text-base-100"
						:class="tagColors(tag.type, tag.value).fg">
						{{ tag.value }}
					</p>
				</div>
			</div>
		</div>
	</div>
	<div v-else-if="mode == ViewMode.Compact"
		class="flex flex-col w-full gap-1 p-2 transition-all rounded-lg cursor-pointer h-min hover:bg-base-300"
		@click="openCard">
		<div class="flex items-center gap-2">
			<img class="object-cover object-center w-4 h-4 select-none" draggable="false" :src="baseCard.image" :alt="baseCard.name">
			<p class="font-bold text-neutral">
				{{ baseCard.name }}
			</p>
		</div>
		<div class="flex items-center gap-2">
			<div v-for="tag in baseCard.tags.filter(t => t.value != 'None')" :key="tag.type"
				:class="tagColors(tag.type, tag.value).bg"
				class="flex w-min items-center gap-1 rounded-full px-1.5 py-0.5">
				<p class="text-xs font-bold whitespace-nowrap text-base-100" :class="tagColors(tag.type, tag.value).fg">
					{{ tag.value }}
				</p>
			</div>
		</div>
	</div>
	<Modal ref="modalCard">
		<div class="flex justify-between gap-2">
			<div class="flex gap-2">
				<div class="relative shrink-0">
					<img v-if="index > -1" class="h-[7.5rem] w-20 select-none rounded-lg object-cover object-center"
						draggable="false" :src="currentCard.image">
					<div v-else
						class="flex h-[7.5rem] w-20 items-center justify-center rounded-lg bg-base-100 text-neutral transition-colors hover:bg-base-300" />
					<div class="absolute top-0 left-0 transition-colors rounded-lg bg-base-100/25 hover:bg-base-100/50">
						<label for="imageInputBox"
							class="flex h-[7.5rem] w-20 cursor-pointer justify-center rounded-lg border-2 border-dashed border-neutral p-4 text-sm transition hover:border-neutral-focus">
							<div class="flex flex-col items-center justify-center">
								<Icon icon="fluent:camera-24-filled" class="w-8 h-8" />
							</div>
							<input id="imageInputBox" type="file" class="sr-only" accept=".png, .jpeg, .jpg, .svg">
						</label>
					</div>
				</div>
				<div class="flex flex-col">
					<h3 contenteditable="true" class="mb-1 text-lg font-extrabold w-fit" @keypress="blurOnEnter"
						@focusout="updateCardName">
						{{ currentCard.name }}
					</h3>
					<p v-if="currentCard.added > 0" class="text-xs">
						Added on
						<span class="font-bold">{{ new Date(currentCard.added * 1000).toLocaleDateString() }}</span>
					</p>
					<p v-if="currentCard.updated > 0" class="text-xs">
						Last change on
						<span class="font-bold">{{ new Date(currentCard.updated * 1000).toLocaleDateString() }}</span>
					</p>
				</div>
			</div>
			<button class="btn-ghost btn-square btn-xs btn hover:bg-error hover:text-base-100"
				@click="modalCard?.closeModal()">
				<Icon icon="fluent:dismiss-16-filled" class="w-4 h-4" />
			</button>
		</div>
		<div class="my-4">
			<div class="flex items-center gap-4">
				<Listbox v-for="cat in categories[currentSection]" :key="cat.name"
					:modelValue="currentCard.tags.find(t => t.type == cat.name.toLowerCase())" :by="compareTags"
					@update:modelValue="value => updateCardTag(value, cat.name.toLowerCase())">
					<div class="relative">
						<ListboxLabel>{{ cat.name }} :</ListboxLabel>
						<ListboxButton
							class="flex items-center gap-2 px-2 py-1 mt-1 text-sm border-2 rounded-lg shadow-lg cursor-pointer border-neutral bg-base-300">
							<Icon :icon="currentCardIcon(cat)" class="w-6 h-6 shrink-0" />
							<p>{{ currentCardTag(cat) }}</p>
							<Icon icon="fluent:chevron-up-down-16-filled" class="w-6 h-6 shrink-0" />
						</ListboxButton>
						<Transition leave-active-class="transition ease-in" leave-from-class="opacity-100"
							leave-to-class="opacity-0">
							<ListboxOptions
								class="absolute w-full mt-2 overflow-hidden text-sm rounded-lg shadow-lg cursor-pointer bg-base-300">
								<ListboxOption v-for="opt in cat.options" v-slot="{ active, selected }" :key="opt.value"
									:value="opt.value" as="template">
									<li :class="{ 'bg-primary text-base-100': active, 'bg-secondary text-base-100 font-bold': selected }"
										class="flex items-center gap-2 px-2 py-1 font-medium transition-colors">
										<Icon :icon="opt.icon" class="w-6 h-6 shrink-0" />
										<p class="truncate">
											{{ opt.value }}
										</p>
									</li>
								</ListboxOption>
							</ListboxOptions>
						</Transition>
					</div>
				</Listbox>
			</div>
		</div>
		<div class="flex justify-between gap-2">
			<button type="button" class="gap-2 px-2 font-bold normal-case btn-error btn-sm btn" @click="deleteCard">
				<Icon icon="eva:trash-2-fill" class="w-6 h-6" />
				<p>Delete</p>
			</button>
			<button type="button" class="gap-2 px-2 font-bold normal-case btn-success btn-sm btn" @click="saveCard">
				<p>Save</p>
				<Icon icon="eva:save-fill" class="w-6 h-6" />
			</button>
		</div>
	</Modal>
</template>