import type { Raw} from 'vue'
import { createApp, markRaw } from 'vue'
import "./assets/main.css"
import 'animate.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { usePageStore } from '@stores/pageStore'
import type { Router } from 'vue-router'
import { Order } from '@/interfaces'

declare module 'pinia' {
    export interface PiniaCustomProperties {
        router: Raw<Router>
    }
}

const pinia = createPinia()

pinia.use(({ store }) => {
    store.router = markRaw(router)
})

const pageStore = usePageStore(pinia)

window.electron.getDB().then(db => {
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
    
    createApp(App).use(router).use(pinia).mount('#app')
})