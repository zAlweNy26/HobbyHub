<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ref } from 'vue'
import { ICard, ViewMode, ICategory, ITag } from '@/interfaces'
import {
    TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle,
    Listbox, ListboxButton, ListboxOptions, ListboxOption, ListboxLabel
} from '@headlessui/vue'
import { useHeaderStore } from '@stores/headerStore'
import { storeToRefs } from 'pinia'

const emit = defineEmits(['delete', 'save'])

const header = useHeaderStore()
const { categories } = storeToRefs(header)

const props = defineProps<{
    content: ICard,
    mode: ViewMode,
    index: number
}>()

const baseCard = ref(props.content)
const isCardOpen = ref(false)
const currentCard = ref<ICard>(baseCard.value)

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
    isCardOpen.value = false
    if (props.index == -1) currentCard.value.added = Date.now() / 1000
    if (currentCard.value.image == "") currentCard.value.image = "/image_template.png"
    currentCard.value.updated = Date.now() / 1000
    baseCard.value = JSON.parse(JSON.stringify(currentCard.value))
    emit("save", props.index, baseCard.value)
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
    currentCard.value = JSON.parse(JSON.stringify(baseCard.value))
    isCardOpen.value = true
}

const deleteCard = () => {
    isCardOpen.value = false
    emit("delete", props.index)
}

const compareTags = (a: ITag, b: string) => {
    return a.value == b
}

const updateCardTag = (value: string, type: string) => {
    currentCard.value.tags.find(t => t.type == type)!.value = value
}
</script>

<template>
    <div v-if="mode == ViewMode.Grid && index == -1" @click="openCard"
        class="flex items-center justify-center overflow-hidden rounded-lg cursor-pointer h-min w-fit">
        <div class="flex items-center justify-center w-40 transition-all duration-200 text-neutral h-60 bg-base-200 hover:scale-110 hover:bg-base-300">
            <Icon icon="fluent:add-16-filled" class="w-14 h-14" />
        </div>
    </div>
    <div v-else-if="mode == ViewMode.Detail && index == -1" @click="openCard"
        class="flex items-center justify-center w-full overflow-hidden rounded-lg cursor-pointer text-neutral h-min">
        <div class="flex items-center justify-center w-full h-[7.5rem] transition-all duration-200 rounded-lg bg-base-200 hover:scale-110 hover:bg-base-300">
            <Icon icon="fluent:add-16-filled" class="w-12 h-12" />
        </div>
    </div>
    <div v-else-if="mode == ViewMode.Compact && index == -1" @click="openCard"
        class="flex items-center justify-center w-full overflow-hidden rounded-lg cursor-pointer text-neutral h-min">
        <div class="flex items-center justify-center w-full h-16 transition-all duration-200 rounded-lg bg-base-200 hover:scale-110 hover:bg-base-300">
            <Icon icon="fluent:add-16-filled" class="w-10 h-10" />
        </div>
    </div>
    <div v-else-if="mode == ViewMode.Grid" @click="openCard"
        class="flex flex-col gap-1 cursor-pointer h-min w-fit">
        <div class="relative inline-block overflow-hidden rounded-lg hover:child-img:scale-110">
            <img class="object-cover object-center w-40 transition-all duration-200 select-none h-60" draggable="false"
                :src="baseCard.image" />
            <p class="absolute bottom-0 left-0 w-full p-1 font-bold text-neutral bg-base-100/75">{{ baseCard.name }}</p>
        </div>
    </div>
    <div v-else-if="mode == ViewMode.Detail" @click="openCard"
        class="flex w-full gap-2 p-2 transition-all rounded-lg cursor-pointer h-min hover:bg-base-300">
        <img class="object-cover object-center w-20 h-[7.5rem] rounded-md select-none" draggable="false" :src="baseCard.image" />
        <div class="flex flex-col gap-1">
            <p class="font-bold text-neutral">{{ baseCard.name }}</p>
            <div class="flex items-center gap-2">
                <div v-for="tag in baseCard.tags.filter(t => t.value != 'None')" :key="tag.type" :class="tagColors(tag.type, tag.value).bg"
                    class="flex items-center gap-1 px-1.5 py-0.5 rounded-full w-min">
                    <p class="text-xs font-bold text-base-100 whitespace-nowrap" :class="tagColors(tag.type, tag.value).fg">{{ tag.value }}</p>
                </div>
            </div>
        </div>
    </div>
    <div v-else-if="mode == ViewMode.Compact" @click="openCard"
        class="flex flex-col w-full gap-1 p-2 transition-all rounded-lg cursor-pointer h-min hover:bg-base-300">
        <div class="flex items-center gap-2">
            <img class="object-cover object-center w-4 h-4 select-none" draggable="false" :src="baseCard.image" />
            <p class="font-bold text-neutral">{{ baseCard.name }}</p>
        </div>
        <div class="flex items-center gap-2">
            <div v-for="tag in baseCard.tags.filter(t => t.value != 'None')" :key="tag.type" :class="tagColors(tag.type, tag.value).bg"
                class="flex items-center gap-1 px-1.5 py-0.5 rounded-full w-min">
                <p class="text-xs font-bold text-base-100 whitespace-nowrap" :class="tagColors(tag.type, tag.value).fg">{{ tag.value }}</p>
            </div>
        </div>
    </div>
    <TransitionRoot appear :show="isCardOpen" as="template">
        <Dialog as="div" @close="isCardOpen = false" class="relative z-10">
            <TransitionChild as="template" enter="duration-200 ease-out" enter-from="opacity-0" enter-to="opacity-100"
                leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
                <div class="fixed inset-0 bg-opacity-50 bg-base-100" />
            </TransitionChild>
            <div class="fixed inset-0 overflow-y-auto selection:bg-secondary-focus">
                <div class="flex items-center justify-center min-h-full p-4 text-center">
                    <TransitionChild as="template" enter="duration-200 ease-out" enter-from="opacity-0 scale-95"
                        enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
                        leave-to="opacity-0 scale-95">
                        <DialogPanel
                            class="w-full max-w-3xl p-4 text-left align-middle transition-all transform shadow-xl text-neutral bg-base-200 rounded-2xl">
                            <DialogTitle as="div" class="flex justify-between gap-2">
                                <div class="flex gap-2">
                                    <div class="relative shrink-0">
                                        <img v-if="index > -1" class="object-cover object-center w-20 h-[7.5rem] rounded-lg select-none" draggable="false" :src="currentCard.image" />
                                        <div v-else class="flex items-center justify-center rounded-lg transition-colors text-neutral w-20 h-[7.5rem] bg-base-100 hover:bg-base-300">
                                            <Icon icon="fluent:add-16-filled" class="w-8 h-8" />
                                        </div>
                                        <div class="absolute top-0 left-0 transition-colors rounded-lg hover:bg-base-100/50">
                                            <label for="imageInputBox" class="w-20 h-[7.5rem] flex justify-center p-4 text-sm transition border-2 border-dashed rounded-lg cursor-pointer border-neutral hover:border-neutral-focus">
                                                <div class="flex flex-col items-center justify-center">
                                                    <Icon icon="eva:cloud-upload-outline" class="w-8 h-8" />
                                                </div>
                                                <input id="imageInputBox" type="file" class="sr-only" accept=".png, .jpeg, .jpg, .svg" />
                                            </label>
                                        </div>
                                    </div>
                                    <div class="flex flex-col">
                                        <h3 contenteditable="true" @keypress="blurOnEnter" @focusout="updateCardName" class="mb-1 text-lg font-extrabold w-fit">{{ currentCard.name }}</h3>
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
                                <button class="btn btn-xs btn-ghost btn-square hover:bg-error hover:text-base-100"
                                    @click="isCardOpen = false">
                                    <Icon icon="fluent:dismiss-16-filled" class="w-4 h-4" />
                                </button>
                            </DialogTitle>
                            <div class="my-4">
                                <div class="flex items-center gap-4">
                                    <Listbox v-for="cat in categories" @update:modelValue="value => updateCardTag(value, cat.name.toLowerCase())"
                                        :modelValue="currentCard.tags.find(t => t.type == cat.name.toLowerCase())" :by="compareTags">
                                        <div class="relative">
                                            <ListboxLabel>{{ cat.name }} :</ListboxLabel>
                                            <ListboxButton
                                                class="flex items-center gap-2 px-2 py-1 mt-1 text-sm border-2 rounded-lg shadow-lg cursor-pointer border-neutral bg-base-300">
                                                <Icon :icon="currentCardIcon(cat)" class="w-6 h-6 shrink-0" />
                                                <p>{{ currentCardTag(cat) }}</p>
                                                <Icon icon="fluent:chevron-up-down-16-filled" class="w-6 h-6 shrink-0" />
                                            </ListboxButton>
                                            <Transition leave-active-class="transition ease-in"
                                                leave-from-class="opacity-100" leave-to-class="opacity-0">
                                                <ListboxOptions
                                                    class="absolute w-full mt-2 overflow-hidden text-sm rounded-lg shadow-lg cursor-pointer bg-base-300">
                                                    <ListboxOption v-slot="{ active, selected }"
                                                        v-for="opt in cat.options" :key="opt.value" :value="opt.value" as="template">
                                                        <li :class="{ 'bg-primary text-base-100': active, 'bg-secondary text-base-100 font-bold': selected }"
                                                            class="flex items-center gap-2 px-2 py-1 font-medium transition-colors">
                                                            <Icon :icon="opt.icon" class="w-6 h-6 shrink-0" />
                                                            <p class="truncate">{{ opt.value }}</p>
                                                        </li>
                                                    </ListboxOption>
                                                </ListboxOptions>
                                            </Transition>
                                        </div>
                                    </Listbox>
                                </div>
                            </div>
                            <div class="flex justify-between gap-2">
                                <button type="button" class="gap-2 px-2 font-bold normal-case btn btn-sm btn-error"
                                    @click="deleteCard">
                                    <Icon icon="eva:trash-2-fill" class="w-6 h-6" />
                                    <p>Delete</p>
                                </button>
                                <button type="button" class="gap-2 px-2 font-bold normal-case btn btn-sm btn-success"
                                    @click="saveCard">
                                    <p>Save</p>
                                    <Icon icon="eva:save-fill" class="w-6 h-6" />
                                </button>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>