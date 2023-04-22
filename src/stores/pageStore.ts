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

    const addSection = (name: string, cardsArr: ICard[] = [], categoriesArr: ICategory[] = []) => {
        categories.value.push(categoriesArr)
        cards.value.push(cardsArr)
        filters.value.push({})
        sortings.value.push({ alphabet: Order.None })
        return sectionsList.value.push(name) - 1
    }

    const deleteSection = (index: number) => {
        sectionsList.value.splice(index, 1)
        categories.value.splice(index, 1)
        cards.value.splice(index, 1)
        filters.value.splice(index, 1)
        sortings.value.splice(index, 1)
        if (sectionsList.value.length === 0) addSection('Template')
        else if (currentSection.value === index) currentSection.value = index == 0 ? 0 : sectionsList.value.length - 1
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

    const getJsonDB = () => {
        const exportedJson: {
            current: number,
            sections: {
                name: string,
                categories: ICategory[],
                cards: ICard[]
            }[]
        } = {
            current: currentSection.value,
            sections: []
        }
        sectionsList.value.forEach((s, i) => {
            exportedJson.sections.push({
                name: s,
                categories: categories.value[i],
                cards: cards.value[i]
            })
        })
        return JSON.stringify(exportedJson, undefined, 2)
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
        addSection,
        deleteSection,
        getJsonDB
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(usePageStore, import.meta.hot))
}