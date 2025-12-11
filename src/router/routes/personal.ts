import PersonalView from "@/components/personal/PersonalView.vue";
import type { RouteRecordRaw } from "vue-router";
import EmpleadoDoctor from "@/components/personal/EmpleadoDoctor.vue";
import EmpleadoEnfermero from "@/components/personal/EmpleadoEnfermero.vue";
const empleadoRoutes: RouteRecordRaw[] = [
  {
    path: "/personal",
    name: "Personal Medico",
    component: PersonalView,
  },
  {
    path: "/personal/doctor/:id",
    name: "EmpleadoDoctor",
    component: EmpleadoDoctor,
    meta: { requiresAuth: true },
  },
  {
    path: "/personal/enfermero/:id",
    name: "EmpleadoEnfermero",
    component: EmpleadoEnfermero,
    meta: { requiresAuth: true },
  },
];

export default empleadoRoutes;
