import { defineStore } from 'pinia'
import { ref } from 'vue'
import { IFilters, ISortings, Status, ViewMode, Order, Platform } from '@/interfaces'

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

    const viewMode = ref<ViewMode>(ViewMode.Grid)
    const currentSection = ref("Template")

    const changeViewMode = (mode: ViewMode) => viewMode.value = mode

    return {
        filters,
        sortings,
        viewMode,
        currentSection,
        changeViewMode
    }
})