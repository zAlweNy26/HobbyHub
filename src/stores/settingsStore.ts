import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
    const isDark = ref(false)

    return {
        isDark
    }
})