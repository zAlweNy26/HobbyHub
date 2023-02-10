<script setup lang="ts">
import { reactive, computed } from 'vue'
import _ from 'lodash'
import Card from '@components/Card.vue'
import { usePageStore } from '@stores/pageStore'
import type { ICard } from '@/interfaces'
import { ViewMode, Order } from '@/interfaces'
import { storeToRefs } from 'pinia'

const page = usePageStore()
const { viewMode, sortings, filters, categories } = storeToRefs(page)

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
    let sortedCards = _.cloneDeep(cards)
    sortedCards.map((v, i) => _.assign(v, { index: i }))
    
    Object.keys(filters.value).forEach((f, i) => {
        const filter = Object.values(filters.value)[i] as number
        if (filter != 0) {
            const opts = categories.value.find(c => c.name.toLowerCase() == f)?.options?.map(o => o.value) ?? []
            sortedCards = sortedCards.filter(c => c.tags.find(t => t.type == f && t.value == opts[filter]))
        }
    })

    if (sortings.value.alphabet == Order.Ascending) sortedCards.sort((c1, c2) => c1.name.localeCompare(c2.name))
    else if (sortings.value.alphabet == Order.Descending) sortedCards.sort((c1, c2) => c2.name.localeCompare(c1.name))

    Object.keys(sortings.value).forEach((s, i) => {
        const sortingsValues = Object.values(sortings.value)
        const sorting = sortingsValues[i]
        if (sorting != 0) {
            const opts = categories.value.find(c => c.name.toLowerCase() == s)?.options?.map(o => o.value) ?? []
            sortedCards = [
                ...sortedCards.filter(c => c.tags.find(t => t.type == s)?.value == opts[sorting]),
                ...sortedCards.filter(c => c.tags.find(t => t.type == s)?.value != opts[sorting]).sort((c1, c2) => {
                    const c1Sort = opts.findIndex(o => o == c1.tags.find(t => t.type == s)?.value)
                    const c2Sort = opts.findIndex(o => o == c2.tags.find(t => t.type == s)?.value)
                    return sorting == 1 ? c1Sort - c2Sort : c2Sort - c1Sort
                })
            ]
        }
    })

    return sortedCards as (ICard & { index: number })[]
})

const templateCard = {
    name: 'Name', 
    image: '', 
    tags: categories.value.map(c => { return { type: c.name.toLowerCase(), value: "None" } }), 
    added: 0, 
    updated: 0
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
	<div class="flex grow flex-wrap content-start overflow-y-auto" :class="{
		'gap-2 p-2 justify-start': viewMode != ViewMode.Grid,
		'justify-around gap-4 p-4': viewMode == ViewMode.Grid
	}">
		<Card :content="templateCard" :mode="viewMode" :index="-1" @save="saveCard" />
		<Card v-for="(card, index) in computedCards" :key="`${card.name}_${index}`" :content="card" :index="card.index" 
			:mode="viewMode" @delete="deleteCard" @save="saveCard" />
	</div>
</template>