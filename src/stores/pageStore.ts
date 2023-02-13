import { defineStore, acceptHMRUpdate } from 'pinia'
import { ref } from 'vue'
import type { ICategory, ICard } from '@/interfaces'
import { ViewMode, Order } from '@/interfaces'

export const usePageStore = defineStore('page', () => {
    const categories = ref<ICategory[]>([
        {
            name: "Status",
            icon: "ph:spinner-bold",
            options: [
                { value: 'None', icon: 'fluent:border-none-24-filled', bg: 'bg-base-200', fg: 'text-neutral' },
                { value: 'Not Started', icon: 'fluent:record-stop-12-filled', bg: 'bg-neutral' },
                { value: 'Dropped', icon: 'fluent:drop-12-filled', bg: 'bg-error' },
                { value: 'Paused', icon: 'fluent:pause-12-filled', bg: 'bg-warning' },
                { value: 'Completed', icon: 'fluent:checkmark-circle-12-filled', bg: 'bg-success' }
            ]
        },
        {
            name: "Platform",
            icon: "fluent:laptop-16-regular",
            options: [
                { value: 'None', icon: 'fluent:border-none-24-filled', bg: 'bg-base-200', fg: 'text-neutral' },
                { value: 'Windows', icon: 'ri:windows-fill', bg: 'bg-[#00A4EF]' },
                { value: 'Nintendo Switch', icon: 'ri:switch-fill', bg: 'bg-[#DD2020]' },
                { value: 'Xbox', icon: 'ri:xbox-fill', bg: 'bg-[#107C10]' },
                { value: 'PlayStation', icon: 'ri:playstation-fill', bg: 'bg-[#006FCD]' }
            ]
        }
    ])

    const categoriesObj = categories.value.map(c => c.name).reduce((acc: {[key: string]: number}, curr) => {
        acc[curr.toLowerCase()] = 0
        return acc
    }, {})

    const filters = ref(Object.assign({}, categoriesObj))

    const sortings = ref(Object.assign({ alphabet: Order.None }, categoriesObj))

    const viewMode = ref<ViewMode>(ViewMode.Grid)
    const currentSection = ref(0)
    const sectionsList = ref(["Template"])

    const changeViewMode = (mode: ViewMode) => viewMode.value = mode

    const updateSection = (index: number, name: string) => {
        if (index >= sectionsList.value.length) return
        sectionsList.value[index] = name
    }

    const cards = ref<ICard[]>([
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

    const saveCard = (index: number, card: ICard) => {
        if (index >= cards.value.length) return
        if (index < 0) cards.value.push(card)
        else cards.value[index] = card
    }
    
    const deleteCard = (index: number) => {
        if (index >= cards.value.length) return
        if (index >= 0) cards.value.splice(index, 1)
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
        deleteCard
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(usePageStore, import.meta.hot))
}