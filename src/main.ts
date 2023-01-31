import { Raw, createApp, markRaw } from 'vue'
import "./assets/main.css"
import 'animate.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import type { Router } from 'vue-router'

declare module 'pinia' {
    export interface PiniaCustomProperties {
        router: Raw<Router>
    }
}

const pinia = createPinia()

pinia.use(({ store }) => {
    store.router = markRaw(router)
})

//watch(pinia.state, state => localStorage.setItem('piniaState', JSON.stringify(state)), { deep: true })

const app = createApp(App)

app.use(router)
app.use(pinia)

app.mount('#app').$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
})
