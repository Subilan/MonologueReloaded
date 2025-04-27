import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue'),
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('@/views/Auth.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/Register.vue')
    },
    {
      path: '/form/overall',
      name: 'form-overall',
      component: () => import('@/views/form/Overall.vue')
    },
    {
      path: '/form/builder',
      name: 'form-builder',
      component: () => import('@/views/form/Builder.vue')
    },
    {
      path: '/:any(.*)',
      name: 'error-404',
      component: () => import('@/views/404.vue')
    }
  ],
})

export default router
