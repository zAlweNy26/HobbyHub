import { createApp } from 'vue'
import "./assets/main.css"
import App from './App.vue'
import router from './router'
import { ipcRenderer } from 'electron'

ipcRenderer.on('page-message', (_event, ...args) => console.log(...args))

const app = createApp(App)

app.use(router)

app.mount('#app').$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
})
