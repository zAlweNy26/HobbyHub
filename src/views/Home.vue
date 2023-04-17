<script setup lang="ts">
import { computed, watch, ref } from 'vue'
import _ from 'lodash'
import Card from '@components/Card.vue'
import { usePageStore } from '@stores/pageStore'
import type { ICard } from '@/interfaces'
import { ViewMode, Order } from '@/interfaces'
import { storeToRefs } from 'pinia'

const page = usePageStore()
const { viewMode, sortings, filters, categories, cards, currentSection } = storeToRefs(page)

const computedCards = computed(() => {
    let sortedCards = _.cloneDeep(cards.value[currentSection.value])
    sortedCards.map((v, i) => _.assign(v, { index: i }))
    
    Object.keys(filters.value[currentSection.value]).forEach((f, i) => {
        const filter = Object.values(filters.value[currentSection.value])[i] as number
        if (filter != 0) {
            const opts = categories.value[currentSection.value].find(c => c.name.toLowerCase() == f)?.options?.map(o => o.value) ?? []
            sortedCards = sortedCards.filter(c => c.tags.find(t => t.type == f && t.value == opts[filter]))
        }
    })

    if (sortings.value[currentSection.value].alphabet == Order.Ascending) sortedCards.sort((c1, c2) => c1.name.localeCompare(c2.name))
    else if (sortings.value[currentSection.value].alphabet == Order.Descending) sortedCards.sort((c1, c2) => c2.name.localeCompare(c1.name))

    Object.keys(sortings.value[currentSection.value]).forEach((s, i) => {
        const sortingsValues = Object.values(sortings.value[currentSection.value])
        const sorting = sortingsValues[i]
        if (sorting != 0) {
            const opts = categories.value[currentSection.value].find(c => c.name.toLowerCase() == s)?.options?.map(o => o.value) ?? []
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

const templateCardRef = ref<InstanceType<typeof Card>>()
const cardsRefs = ref<InstanceType<typeof Card>[]>([])

window.electron.addCard(() => {
    if (cardsRefs.value.every(c => !c.modalCard?.isOpen)) templateCardRef.value?.openCard()
})

const templateCard = ref<ICard>()

watch(currentSection, () => {
    templateCard.value = {
        name: 'Name', 
        image: '', 
        tags: categories.value[currentSection.value].map(c => { return { type: c.name.toLowerCase(), value: "None" } }), 
        added: 0, 
        updated: 0
    }
}, { immediate: true })
</script>

<template>
	<div class="flex flex-wrap content-start overflow-y-auto grow" :class="{
		'gap-2 p-2 justify-start': viewMode != ViewMode.Grid,
		'justify-around gap-4 p-4': viewMode == ViewMode.Grid
	}">
		<Card ref="templateCardRef" :content="templateCard!" :mode="viewMode" :index="-1" 
			@save="page.saveCard" />
		<Card v-for="(card, index) in computedCards" ref="cardsRefs" 
			:key="`${card.name}_${index}`" :content="card" :index="card.index" 
			:mode="viewMode" @delete="page.deleteCard" @save="page.saveCard" />
	</div>
</template>