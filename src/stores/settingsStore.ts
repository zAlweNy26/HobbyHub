import { defineStore, acceptHMRUpdate } from 'pinia'
import { ref } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
    const isDark = ref(false)
    const languagesList = ref(["English", "French", "Italian", "German", "Spanish"])
    const currentLanguage = ref(languagesList.value[0])

    return {
        isDark,
        languagesList,
        currentLanguage
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useSettingsStore, import.meta.hot))
}