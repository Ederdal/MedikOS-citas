import { createRouter, createWebHistory } from "vue-router";
import publicRoutes from './routes/public'
import authRoutes from "./routes/auth";
import privateRoutes from "./routes/private";
import doctorRoutes from "./routes/doctor";
import setupGuard from "./guard";
import farmaciaRoutes from "./routes/farmacia";
import empleadoRoutes from "./routes/personal";

const routes = [
  ...publicRoutes,
  ...authRoutes,
  ...privateRoutes,
  ...doctorRoutes,
  ...farmaciaRoutes,
  ...empleadoRoutes
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

//setupGuard(router)

export default router;
