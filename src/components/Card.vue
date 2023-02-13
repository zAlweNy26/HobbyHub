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
const { categories } = storeToRefs(page)

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
	const category = categories.value.find(c => c.name.toLowerCase() == cat)
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
</script>

<template>
	<div v-if="mode == ViewMode.Grid && index == -1"
		class="flex h-min w-fit cursor-pointer items-center justify-center overflow-hidden rounded-lg"
		@click="openCard">
		<div
			class="flex h-60 w-40 items-center justify-center bg-base-200 text-neutral transition-all duration-200 hover:scale-110 hover:bg-base-300">
			<Icon icon="fluent:add-16-filled" class="h-14 w-14" />
		</div>
	</div>
	<div v-else-if="mode == ViewMode.Detail && index == -1"
		class="flex h-min w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg text-neutral"
		@click="openCard">
		<div
			class="flex h-[7.5rem] w-full items-center justify-center rounded-lg bg-base-200 transition-all duration-200 hover:scale-110 hover:bg-base-300">
			<Icon icon="fluent:add-16-filled" class="h-12 w-12" />
		</div>
	</div>
	<div v-else-if="mode == ViewMode.Compact && index == -1"
		class="flex h-min w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg text-neutral"
		@click="openCard">
		<div
			class="flex h-16 w-full items-center justify-center rounded-lg bg-base-200 transition-all duration-200 hover:scale-110 hover:bg-base-300">
			<Icon icon="fluent:add-16-filled" class="h-10 w-10" />
		</div>
	</div>
	<div v-else-if="mode == ViewMode.Grid" class="flex h-min w-fit cursor-pointer flex-col gap-1" @click="openCard">
		<div class="relative inline-block overflow-hidden rounded-lg hover:child-img:scale-110">
			<img class="h-60 w-40 select-none object-cover object-center transition-all duration-200" draggable="false"
				:src="baseCard.image">
			<p class="absolute bottom-0 left-0 w-full bg-base-100/75 p-1 font-bold text-neutral">
				{{ baseCard.name }}
			</p>
		</div>
	</div>
	<div v-else-if="mode == ViewMode.Detail"
		class="flex h-min w-full cursor-pointer gap-2 rounded-lg p-2 transition-all hover:bg-base-300"
		@click="openCard">
		<img class="h-[7.5rem] w-20 select-none rounded-md object-cover object-center" draggable="false"
			:src="baseCard.image">
		<div class="flex flex-col">
			<p class="font-bold text-neutral">
				{{ baseCard.name }}
			</p>
			<p class="text-xs font-semibold text-neutral">
				Added on {{ new Date(currentCard.added * 1000).toLocaleDateString() }}
			</p>
			<div class="mt-1 flex items-center gap-2">
				<div v-for="tag in baseCard.tags.filter(t => t.value != 'None')" :key="tag.type"
					:class="tagColors(tag.type, tag.value).bg"
					class="flex w-min items-center gap-1 rounded-full px-1.5 py-0.5">
					<p class="whitespace-nowrap text-xs font-bold text-base-100"
						:class="tagColors(tag.type, tag.value).fg">
						{{ tag.value }}
					</p>
				</div>
			</div>
		</div>
	</div>
	<div v-else-if="mode == ViewMode.Compact"
		class="flex h-min w-full cursor-pointer flex-col gap-1 rounded-lg p-2 transition-all hover:bg-base-300"
		@click="openCard">
		<div class="flex items-center gap-2">
			<img class="h-4 w-4 select-none object-cover object-center" draggable="false" :src="baseCard.image">
			<p class="font-bold text-neutral">
				{{ baseCard.name }}
			</p>
		</div>
		<div class="flex items-center gap-2">
			<div v-for="tag in baseCard.tags.filter(t => t.value != 'None')" :key="tag.type"
				:class="tagColors(tag.type, tag.value).bg"
				class="flex w-min items-center gap-1 rounded-full px-1.5 py-0.5">
				<p class="whitespace-nowrap text-xs font-bold text-base-100" :class="tagColors(tag.type, tag.value).fg">
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
					<div class="absolute top-0 left-0 rounded-lg bg-base-100/25 transition-colors hover:bg-base-100/50">
						<label for="imageInputBox"
							class="flex h-[7.5rem] w-20 cursor-pointer justify-center rounded-lg border-2 border-dashed border-neutral p-4 text-sm transition hover:border-neutral-focus">
							<div class="flex flex-col items-center justify-center">
								<Icon icon="fluent:camera-24-filled" class="h-8 w-8" />
							</div>
							<input id="imageInputBox" type="file" class="sr-only" accept=".png, .jpeg, .jpg, .svg">
						</label>
					</div>
				</div>
				<div class="flex flex-col">
					<h3 contenteditable="true" class="mb-1 w-fit text-lg font-extrabold" @keypress="blurOnEnter"
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
				<Icon icon="fluent:dismiss-16-filled" class="h-4 w-4" />
			</button>
		</div>
		<div class="my-4">
			<div class="flex items-center gap-4">
				<Listbox v-for="cat in categories" :key="cat.name"
					:modelValue="currentCard.tags.find(t => t.type == cat.name.toLowerCase())" :by="compareTags"
					@update:modelValue="value => updateCardTag(value, cat.name.toLowerCase())">
					<div class="relative">
						<ListboxLabel>{{ cat.name }} :</ListboxLabel>
						<ListboxButton
							class="mt-1 flex cursor-pointer items-center gap-2 rounded-lg border-2 border-neutral bg-base-300 px-2 py-1 text-sm shadow-lg">
							<Icon :icon="currentCardIcon(cat)" class="h-6 w-6 shrink-0" />
							<p>{{ currentCardTag(cat) }}</p>
							<Icon icon="fluent:chevron-up-down-16-filled" class="h-6 w-6 shrink-0" />
						</ListboxButton>
						<Transition leave-active-class="transition ease-in" leave-from-class="opacity-100"
							leave-to-class="opacity-0">
							<ListboxOptions
								class="absolute mt-2 w-full cursor-pointer overflow-hidden rounded-lg bg-base-300 text-sm shadow-lg">
								<ListboxOption v-for="opt in cat.options" v-slot="{ active, selected }" :key="opt.value"
									:value="opt.value" as="template">
									<li :class="{ 'bg-primary text-base-100': active, 'bg-secondary text-base-100 font-bold': selected }"
										class="flex items-center gap-2 px-2 py-1 font-medium transition-colors">
										<Icon :icon="opt.icon" class="h-6 w-6 shrink-0" />
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
			<button type="button" class="btn-error btn-sm btn gap-2 px-2 font-bold normal-case" @click="deleteCard">
				<Icon icon="eva:trash-2-fill" class="h-6 w-6" />
				<p>Delete</p>
			</button>
			<button type="button" class="btn-success btn-sm btn gap-2 px-2 font-bold normal-case" @click="saveCard">
				<p>Save</p>
				<Icon icon="eva:save-fill" class="h-6 w-6" />
			</button>
		</div>
	</Modal>
</template>