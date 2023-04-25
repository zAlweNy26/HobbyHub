import { createApp } from 'vue'
import "./assets/main.css"
import 'animate.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import { usePageStore } from '@stores/pageStore'
import { Order } from '@/interfaces'
import enUS from "./locales/en-US.json"
import itIT from "./locales/it-IT.json"
import esES from "./locales/es-ES.json"
import deDE from "./locales/de-DE.json"
import frFR from "./locales/fr-FR.json"

const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: 'English',
    fallbackLocale: 'English',
    messages: {
        'English': enUS,
        'Italiano': itIT,
        'Español': esES,
        'Deutsch': deDE,
        'Français': frFR,
    }
})

const pinia = createPinia()

const pageStore = usePageStore(pinia)

window.electron.getDB().then(db => {
    if (db) {
        pageStore.currentSection = db.current
        db.sections.forEach(section => {
            pageStore.sectionsList.push(section.name)
            pageStore.categories.push(section.categories)
            pageStore.cards.push(section.cards)
            const categoriesObj = section.categories.map(c => c.name).reduce((acc: {[key: string]: number}, curr) => {
                acc[curr.toLowerCase()] = 0
                return acc
            }, {})
            pageStore.filters.push(Object.assign({}, categoriesObj))
            pageStore.sortings.push(Object.assign({ alphabet: Order.None }, categoriesObj))
        })
    }
    
    createApp(App).use(i18n).use(pinia).mount('#app')
})