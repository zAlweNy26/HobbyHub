<script setup lang="ts">
import { reactive, computed } from 'vue'
import Card from '@components/Card.vue'
import { useHeaderStore } from '@stores/headerStore'
import { ICard, ViewMode, Order, Status, Platform } from '@/interfaces'
import { storeToRefs } from 'pinia'

const header = useHeaderStore()
const { viewMode, sortings, filters } = storeToRefs(header)

const cards = reactive<ICard[]>([
    { name: 'Unpacking', image: 'https://howlongtobeat.com/games/69666_Unpacking_(2021).jpg', tags: [
        { type: 'status', value: "Completed", color: 'bg-success' },
        { type: 'platform', value: "PC", color: 'bg-warning' },
    ]},
    { name: 'Elden Ring', image: 'https://howlongtobeat.com/games/68151_Elden_Ring.jpg', tags: [
        { type: 'status', value: "Not Started", color: 'bg-neutral' },
        { type: 'platform', value: "PlayStation", color: 'bg-[#006FCD]' },
    ]},
    { name: 'Animal Crossing: New Horizons', image: 'https://howlongtobeat.com/games/68240_Animal_Crossing_New_Horizons.jpg', tags: [
        { type: 'status', value: "Paused", color: 'bg-info' },
        { type: 'platform', value: "Nintendo Switch", color: 'bg-[#DD2020]' },
    ]},
    { name: 'Dragon Quest XI: Echoes of an Elusive Age', image: 'https://howlongtobeat.com/games/39508_Dragon_Quest_XI_In_Search_of_Departed_Time.jpg', tags: [
        { type: 'status', value: "Completed", color: 'bg-success' },
        { type: 'platform', value: "PC", color: 'bg-warning' },
    ]},
    { name: 'Cyberpunk 2077', image: 'https://howlongtobeat.com/games/Cyberpunk-2077-2.jpg', tags: [
        { type: 'status', value: "Dropped", color: 'bg-error' },
        { type: 'platform', value: "PC", color: 'bg-warning' },
    ]},
    { name: 'Rocket League', image: 'https://howlongtobeat.com/games/Rocket_League_header.jpg', tags: [
        { type: 'status', value: "Paused", color: 'bg-info' },
        { type: 'platform', value: "Xbox", color: 'bg-[#107C10]' },
    ]},
])

const computedCards = computed(() => {
    let sortedCards: ICard[] = JSON.parse(JSON.stringify(cards))

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
</script>

<template>
    <div class="flex flex-wrap content-start grow" 
        :class="{ 
            'gap-0 p-2 justify-start': viewMode != ViewMode.Grid, 
            'justify-around gap-4 p-4': viewMode == ViewMode.Grid 
        }">
        <Card v-for="c in computedCards" :key="c.name" :content="c" :mode="viewMode" />
    </div>
</template>