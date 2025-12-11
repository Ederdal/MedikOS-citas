import FarmaciaMedicamentos from '@/pages/farmacia/FarmaciaMedicamentos.vue'
import type { RouteRecordRaw } from 'vue-router'

const farmaciaRoutes: RouteRecordRaw[] = [
  {
    path: '/farmacia/medicamentos',
    name: 'Farmacia',
    component: FarmaciaMedicamentos,
  }
]

export default farmaciaRoutes
