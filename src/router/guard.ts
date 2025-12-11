import type { Router } from 'vue-router'
import { useToast } from 'vue-toastification'

export default function setupGuard(router: Router) {
  router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')
    const requiresAuth = to.meta.requiresAuth as boolean
    const toast = useToast() as any

    if (requiresAuth && !token) {
      toast.add({ title: 'Acceso denegado', description: 'Inicia sesión para acceder a la aplicación' })
      return next({ name: 'Login' })
    }

    next()
  })
}
