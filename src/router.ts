import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import Home from '@views/Home.vue'

const router = createRouter({
  history: process.env.IS_WEB ? createWebHistory(import.meta.env.BASE_URL) : createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    }
  ]
})

export default router
