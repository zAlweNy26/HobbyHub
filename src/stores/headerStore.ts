import { defineStore } from 'pinia'
import { ref } from 'vue'
import { IFilters, Status, ViewMode } from '@/interfaces'

export const useHeaderStore = defineStore('header', () => {
    const filters = ref<IFilters>({
        alphabet: false,
        status: Status.None
    })

    const viewMode = ref<ViewMode>(ViewMode.Grid)
    const currentSection = ref("")

    const changeViewMode = (mode: ViewMode) => viewMode.value = mode

    return {
        filters,
        viewMode,
        currentSection,
        changeViewMode
    }
})