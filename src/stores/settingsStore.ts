import { defineStore, acceptHMRUpdate } from 'pinia'
import { ref } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
    const isDark = ref(false)
    const currentLanguage = ref("English")
    const zoom = ref(100)

    return {
        isDark,
        currentLanguage,
        zoom
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useSettingsStore, import.meta.hot))
}