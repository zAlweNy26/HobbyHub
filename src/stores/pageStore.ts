import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ICategory } from '@/interfaces';
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
    const sectionsList = ref(["Template", "Games"])

    const changeViewMode = (mode: ViewMode) => viewMode.value = mode

    const updateSection = (index: number, name: string) => {
        if (index >= sectionsList.value.length) return;
        sectionsList.value[index] = name;
    }

    return {
        filters,
        sortings,
        viewMode,
        currentSection,
        changeViewMode,
        sectionsList,
        categories,
        updateSection
    }
})