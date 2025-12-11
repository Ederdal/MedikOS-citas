import type { RouteRecordRaw } from 'vue-router'
import CitasMedicasPage from '@/pages/doctor/CitasMedicasPage.vue'
import RegistrarCitaPage from '@/pages/doctor/RegistrarCitaPage.vue';
import GraficasPage from '@/pages/admin/GraficasPage.vue';
import AyudaPage from '@/pages/shared/AyudaPage.vue';
import PerfilPage from '@/pages/doctor/PerfilPage.vue';
import NotaMedicaPage from '@/pages/doctor/NotaMedicaPage.vue';
import PatientChatPage from '@/pages/chat/PatientChatPage.vue';
import DoctorChatPage from '@/pages/chat/DoctorChatPage.vue';

const doctorRoutes: RouteRecordRaw[] = [
    {
      path: '/citas-medicas',
      name: 'Citas Médicas',
      component: CitasMedicasPage,
      meta: { requiresAuth: true }
    },
    {
      path: '/nota-medica',
      name: 'Notas Médicas',
      component: NotaMedicaPage,
      meta: { requiresAuth: true }
    },
    {
      path: '/citas-medicas/registrar',
      name: 'Registrar Cita Médica',
      component: RegistrarCitaPage,
      meta: { requiresAuth: true }
    },
    {
      path: '/graficas',
      name: 'Gráficas',
      component: GraficasPage,
      meta: { requiresAuth: true }
    },
    {
      path: '/ayuda',
      name: 'Ayuda',
      component: AyudaPage,
      meta: { requiresAuth: true }
    },
    {
      path: '/perfil',
      name: 'Mi Perfil',
      component: PerfilPage,
      meta: { requiresAuth: true }
    },
    {
      path: "/doctorChat",
      name: "ChatD",
      component: DoctorChatPage,
      meta: { requiresAuth: true }
    },
    {
      path: "/patientChat",
      name: "ChatP",
      component: PatientChatPage,
      meta: { requiresAuth: true }
    },
]

export default doctorRoutes;
