import { createRouter, createWebHistory } from 'vue-router'
import PokedexVue from '@/components/Pokedex.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: PokedexVue
    },
  ]
})

export default router
