import type { RouteRecordRaw } from 'vue-router'
import DashboardPage from '@/pages/dashboard/DashboardPage.vue'

const privateRoutes: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardPage,
    meta: { requiresAuth: true }
  }
]

export default privateRoutes
