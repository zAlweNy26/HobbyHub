import { defineStore } from 'pinia'
import { ref } from 'vue'
import { IFilters, ISortings, Status, ViewMode, Order, Platform, ICategory } from '@/interfaces'

export const useHeaderStore = defineStore('header', () => {
    const filters = ref<IFilters>({
        status: Status.None,
        platform: Platform.None
    })

    const sortings = ref<ISortings>({
        alphabet: Order.None,
        status: Status.None,
        platform: Platform.None
    })

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