import type { RouteRecordRaw } from 'vue-router'
import DashboardPage from '@/pages/dashboard/DashboardPage.vue'
import GraficasPage from '@/pages/admin/GraficasPage.vue'

const privateRoutes: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/graficas',
    name: 'Graficas',
    component: GraficasPage,
    meta: { requiresAuth: true }
  }
]

export default privateRoutes
