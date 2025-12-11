import type { RouteRecordRaw } from 'vue-router'
import LandingPage from '@/pages/landing/LandingPage.vue'
import NotFound from '@/pages/shared/NotFound.vue'

const publicRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Landing',
    component: LandingPage
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: { requiresAuth: true }
  }
]

export default publicRoutes;
