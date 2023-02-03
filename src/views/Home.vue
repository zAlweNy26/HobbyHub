<script setup lang="ts">
import { reactive, computed } from 'vue'
import Card from '@components/Card.vue'
import { useHeaderStore } from '@stores/headerStore'
import { ICard, ViewMode, Order, Status, Platform } from '@/interfaces'
import { storeToRefs } from 'pinia'

const header = useHeaderStore()
const { viewMode, sortings, filters } = storeToRefs(header)

const cards = reactive<ICard[]>([
    {
        name: 'Unpacking', image: 'https://howlongtobeat.com/games/69666_Unpacking_(2021).jpg', tags: [
            { type: 'status', value: "Completed" },
            { type: 'platform', value: "Windows" },
        ], added: 1671835908, updated: 1673624379
    },
    {
        name: 'Animal Crossing: New Horizons', image: 'https://howlongtobeat.com/games/68240_Animal_Crossing_New_Horizons.jpg', tags: [
            { type: 'status', value: "Paused" },
            { type: 'platform', value: "Nintendo Switch" },
        ], added: 23345340, updated: 3452340
    },
    {
        name: 'Elden Ring', image: 'https://howlongtobeat.com/games/68151_Elden_Ring.jpg', tags: [
            { type: 'status', value: "Not Started" },
            { type: 'platform', value: "PlayStation" },
        ], added: 452540, updated: 353453250
    },
    {
        name: 'Dragon Quest XI: Echoes of an Elusive Age: Definitive Edition', image: 'https://howlongtobeat.com/games/39508_Dragon_Quest_XI_In_Search_of_Departed_Time.jpg', tags: [
            { type: 'status', value: "Completed" },
            { type: 'platform', value: "Windows" },
        ], added: 1626457604, updated: 1671835908
    },
    {
        name: 'Cyberpunk 2077', image: 'https://howlongtobeat.com/games/Cyberpunk-2077-2.jpg', tags: [
            { type: 'status', value: "Dropped" },
            { type: 'platform', value: "Windows" },
        ], added: 23542350, updated: 523542350
    },
    {
        name: 'Rocket League', image: 'https://howlongtobeat.com/games/Rocket_League_header.jpg', tags: [
            { type: 'status', value: "Paused" },
            { type: 'platform', value: "Xbox" },
        ], added: 3452345520, updated: 34523450
    },
])

const computedCards = computed(() => {
    let sortedCards: (ICard & { index: number })[] = JSON.parse(JSON.stringify(cards))
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

    return sortedCards
})

const templateCard = {
    name: 'Name', 
    image: '', 
    tags: [
        { type: 'status', value: "None" },
        { type: 'platform', value: "None" },
    ], 
    added: 0, 
    updated: 0,
    index: -1
}

const saveCard = (index: number, card: ICard) => {
    if (index > -1) cards[index] = card
    else cards.push(card)
}

const deleteCard = (index: number) => {
    if (index > -1) cards.splice(index, 1)
}
</script>

<template>
    <div class="flex flex-wrap content-start overflow-y-auto grow" :class="{
        'gap-2 p-2 justify-start': viewMode != ViewMode.Grid,
        'justify-around gap-4 p-4': viewMode == ViewMode.Grid
    }">
        <Card :content="templateCard" :mode="viewMode" :index="templateCard.index" @save="saveCard" />
        <Card v-for="card in computedCards" :key="card.index" :content="card" :index="card.index" 
            :mode="viewMode" @delete="deleteCard" @save="saveCard" />
    </div>
</template>