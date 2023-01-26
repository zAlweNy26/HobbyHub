import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@views/Home.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL), //createWebHistory(import.meta.env.BASE_URL) se si è sul web
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    }
  ]
})

export default router
