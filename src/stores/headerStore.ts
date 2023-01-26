import { defineStore } from 'pinia'
import { ref } from 'vue'
import { IFilters, Status, ViewMode } from '@/interfaces'

export const useHeaderStore = defineStore('header', () => {
    const filters = ref<IFilters>({
        alphabet: false,
        status: Status.None
    })

    const viewMode = ref<ViewMode>(ViewMode.Grid)
    const zoom = ref(100)
    const currentSection = ref("")

    const changeViewMode = (mode: ViewMode) => viewMode.value = mode

    const updateZoom = (perc: number) => zoom.value = Math.max(10, Math.min(200, zoom.value += perc))

    return {
        filters,
        viewMode,
        zoom,
        currentSection,
        updateZoom,
        changeViewMode
    }
})