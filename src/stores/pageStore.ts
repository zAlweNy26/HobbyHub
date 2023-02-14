import { defineStore, acceptHMRUpdate } from 'pinia'
import { ref } from 'vue'
import type { ICategory, ICard } from '@/interfaces'
import { ViewMode, Order } from '@/interfaces'

export const usePageStore = defineStore('page', () => {
    const categories = ref<ICategory[][]>([])

    const filters = ref<{
        [key: string]: number
    }[]>([])

    const sortings = ref<{
        alphabet: Order
        [key: string]: number
    }[]>([])

    const viewMode = ref<ViewMode>(ViewMode.Grid)
    const currentSection = ref(0)
    const sectionsList = ref<string[]>([])
    const cards = ref<ICard[][]>([])

    const changeViewMode = (mode: ViewMode) => viewMode.value = mode

    const updateSection = (index: number, name: string) => {
        if (index >= sectionsList.value.length) return
        sectionsList.value[index] = name
    }

    const addSection = (name: string) => {
        categories.value.push([])
        cards.value.push([])
        filters.value.push({})
        sortings.value.push({ alphabet: Order.None })
        return sectionsList.value.push(name) - 1
    }

    const saveCard = (index: number, card: ICard) => {
        if (index >= cards.value.length) return
        if (index < 0) cards.value[currentSection.value].push(card)
        else cards.value[currentSection.value][index] = card
    }
    
    const deleteCard = (index: number) => {
        if (index >= cards.value[currentSection.value].length) return
        if (index >= 0) cards.value[currentSection.value].splice(index, 1)
    }

    return {
        filters,
        sortings,
        viewMode,
        currentSection,
        changeViewMode,
        sectionsList,
        categories,
        updateSection,
        cards,
        saveCard,
        deleteCard,
        addSection
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(usePageStore, import.meta.hot))
}