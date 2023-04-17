import { defineStore, acceptHMRUpdate } from 'pinia'
import { ref } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
    const supportedLocales = {
        'en-US': "English",
        'it-IT': "Italiano"
    }

    const isDark = ref(false)
    const currentLanguage = ref('en-US')
    const zoom = ref(100)

    return {
        isDark,
        currentLanguage,
        zoom,
        supportedLocales
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useSettingsStore, import.meta.hot))
}