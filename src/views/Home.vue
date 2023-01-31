<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { reactive, computed, ref } from 'vue'
import Card from '@components/Card.vue'
import { useHeaderStore } from '@stores/headerStore'
import { ICard, ViewMode, Order, Status, Platform } from '@/interfaces'
import { storeToRefs } from 'pinia'
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'

const header = useHeaderStore()
const { viewMode, sortings, filters } = storeToRefs(header)

const cards = reactive<ICard[]>([
    {
        name: 'Unpacking', image: 'https://howlongtobeat.com/games/69666_Unpacking_(2021).jpg', tags: [
            { type: 'status', value: "Completed", color: 'bg-success' },
            { type: 'platform', value: "PC", color: 'bg-warning' },
        ]
    },
    {
        name: 'Elden Ring', image: 'https://howlongtobeat.com/games/68151_Elden_Ring.jpg', tags: [
            { type: 'status', value: "Not Started", color: 'bg-neutral' },
            { type: 'platform', value: "PlayStation", color: 'bg-[#006FCD]' },
        ]
    },
    {
        name: 'Animal Crossing: New Horizons', image: 'https://howlongtobeat.com/games/68240_Animal_Crossing_New_Horizons.jpg', tags: [
            { type: 'status', value: "Paused", color: 'bg-info' },
            { type: 'platform', value: "Nintendo Switch", color: 'bg-[#DD2020]' },
        ]
    },
    {
        name: 'Dragon Quest XI: Echoes of an Elusive Age', image: 'https://howlongtobeat.com/games/39508_Dragon_Quest_XI_In_Search_of_Departed_Time.jpg', tags: [
            { type: 'status', value: "Completed", color: 'bg-success' },
            { type: 'platform', value: "PC", color: 'bg-warning' },
        ]
    },
    {
        name: 'Cyberpunk 2077', image: 'https://howlongtobeat.com/games/Cyberpunk-2077-2.jpg', tags: [
            { type: 'status', value: "Dropped", color: 'bg-error' },
            { type: 'platform', value: "PC", color: 'bg-warning' },
        ]
    },
    {
        name: 'Rocket League', image: 'https://howlongtobeat.com/games/Rocket_League_header.jpg', tags: [
            { type: 'status', value: "Paused", color: 'bg-info' },
            { type: 'platform', value: "Xbox", color: 'bg-[#107C10]' },
        ]
    },
])

const computedCards = computed(() => {
    let sortedCards: ICard[] = JSON.parse(JSON.stringify(cards))
    sortedCards.map((v, i) => Object.assign(v, { index: i }))

    if (filters.value.status != Status.None) {
        sortedCards = sortedCards.filter(c => c.tags.find(t => t.type == 'status' && t.value == Object.values(Status)[filters.value.status]))
    }

    if (filters.value.platform != Platform.None) {
        sortedCards = sortedCards.filter(c => c.tags.find(t => t.type == 'platform' && t.value == Object.values(Platform)[filters.value.platform]))
    }

    if (sortings.value.alphabet == Order.Ascending) sortedCards.sort((c1, c2) => c1.name.localeCompare(c2.name))
    else if (sortings.value.alphabet == Order.Descending) sortedCards.sort((c1, c2) => c2.name.localeCompare(c1.name))

    if (sortings.value.status != Status.None) {
        const currentStatus = Object.values(Status)[sortings.value.status]
        const isFirstStatus = Object.keys(Status)[sortings.value.status] == Object.keys(Status)[1]

        sortedCards = [
            ...sortedCards.filter(c => c.tags.find(t => t.type == 'status')?.value == currentStatus),
            ...sortedCards.filter(c => c.tags.find(t => t.type == 'status')?.value != currentStatus).sort((c1, c2) =>
                isFirstStatus ? Status[c1.tags.find(t => t.type == 'status')?.value as keyof typeof Status] -
                    Status[c2.tags.find(t => t.type == 'status')?.value as keyof typeof Status] :
                    Status[c2.tags.find(t => t.type == 'status')?.value as keyof typeof Status] -
                    Status[c1.tags.find(t => t.type == 'status')?.value as keyof typeof Status]
            )
        ]
    }

    if (sortings.value.platform != Platform.None) {
        const currentPlatform = Object.values(Platform)[sortings.value.platform]
        const isFirstPlatform = Object.keys(Platform)[sortings.value.platform] == Object.keys(Platform)[1]

        sortedCards = [
            ...sortedCards.filter(c => c.tags.find(t => t.type == 'platform')?.value == currentPlatform),
            ...sortedCards.filter(c => c.tags.find(t => t.type == 'platform')?.value != currentPlatform).sort((c1, c2) =>
                isFirstPlatform ? Platform[c1.tags.find(t => t.type == 'platform')?.value as keyof typeof Platform] -
                    Platform[c2.tags.find(t => t.type == 'platform')?.value as keyof typeof Platform] :
                    Platform[c2.tags.find(t => t.type == 'platform')?.value as keyof typeof Platform] -
                    Platform[c1.tags.find(t => t.type == 'platform')?.value as keyof typeof Platform]
            )
        ]
    }

    return sortedCards as (ICard & { index: number })[]
})

const isCardOpen = ref(false)
const currentCard = ref<ICard & { index: number }>()

const openCard = (index: number) => {
    currentCard.value = JSON.parse(JSON.stringify(computedCards.value[index]))
    isCardOpen.value = true
}

const saveCard = () => {
    if (currentCard.value != undefined) {
        cards[currentCard.value.index] = currentCard.value
        isCardOpen.value = false
    }
}

const deleteCard = () => {
    if (currentCard.value != undefined) {
        cards.splice(currentCard.value.index, 1)
        isCardOpen.value = false
    }
}
</script>

<template>
    <div class="flex flex-wrap content-start grow" :class="{
        'gap-2 p-2 justify-start': viewMode != ViewMode.Grid,
        'justify-around gap-4 p-4': viewMode == ViewMode.Grid
    }">
        <div v-if="viewMode == ViewMode.Grid" class="flex items-center justify-center overflow-hidden rounded-lg cursor-pointer h-min w-fit">
            <div class="flex items-center justify-center h-56 transition-all duration-200 w-36 bg-base-200 hover:scale-110 hover:bg-base-300">
                <Icon icon="fluent:add-16-filled" class="w-12 h-12" />
            </div>
        </div>
        <div v-else-if="viewMode == ViewMode.Detail" 
            class="flex items-center justify-center w-full overflow-hidden rounded-lg cursor-pointer h-min">
            <div class="flex items-center justify-center w-full transition-all duration-200 rounded-lg h-28 bg-base-200 hover:scale-110 hover:bg-base-300">
                <Icon icon="fluent:add-16-filled" class="w-12 h-12" />
            </div>
        </div>
        <div v-else-if="viewMode == ViewMode.Compact" 
            class="flex items-center justify-center w-full overflow-hidden rounded-lg cursor-pointer h-min">
            <div class="flex items-center justify-center w-full h-16 transition-all duration-200 rounded-lg bg-base-200 hover:scale-110 hover:bg-base-300">
                <Icon icon="fluent:add-16-filled" class="w-12 h-12" />
            </div>
        </div>
        <Card v-for="(card, index) in computedCards" :key="card.name" :content="card" :mode="viewMode"
            @click="openCard(index)" />
        <TransitionRoot appear :show="isCardOpen" as="template">
            <Dialog as="div" @close="isCardOpen = false" class="relative z-10">
                <TransitionChild as="template" enter="duration-200 ease-out" enter-from="opacity-0"
                    enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
                    <div class="fixed inset-0 bg-opacity-50 bg-base-100" />
                </TransitionChild>
                <div class="fixed inset-0 overflow-y-auto">
                    <div class="flex items-center justify-center min-h-full p-4 text-center">
                        <TransitionChild as="template" enter="duration-200 ease-out" enter-from="opacity-0 scale-95"
                            enter-to="opacity-100 scale-100" leave="duration-200 ease-in"
                            leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95">
                            <DialogPanel
                                class="w-full max-w-lg p-4 overflow-hidden text-left align-middle transition-all transform shadow-xl text-neutral bg-base-200 rounded-2xl">
                                <DialogTitle as="div" class="flex justify-between text-lg font-bold">
                                    <h3>{{ currentCard?.name }}</h3>
                                    <button type="button" class="btn btn-xs btn-ghost btn-square hover:bg-error hover:text-base-100" @click="isCardOpen = false">
                                        <Icon icon="fluent:dismiss-16-filled" class="w-4 h-4" />
                                    </button>
                                </DialogTitle>
                                <div class="my-4">
                                    <div class="flex items-center gap-2">
                                        <div v-for="tag in currentCard?.tags" :key="tag.type" :class="tag.color"
                                            class="flex items-center gap-1 px-1.5 py-0.5 rounded-full w-min">
                                            <p class="text-xs font-bold text-base-100 whitespace-nowrap">{{ tag.value }}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex justify-between gap-2">
                                    <button type="button" class="gap-2 px-2 font-bold normal-case btn btn-sm btn-error" @click="deleteCard">
                                        <Icon icon="eva:trash-2-fill" class="w-6 h-6" />
                                        <p>Delete</p>
                                    </button>
                                    <button type="button" class="gap-2 px-2 font-bold normal-case btn btn-sm btn-success" @click="saveCard">
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
    </div>
</template>