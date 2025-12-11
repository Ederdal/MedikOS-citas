import type { Router } from 'vue-router'

export default function setupGuard(router: Router) {
  router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')
    const requiresAuth = to.meta.requiresAuth as boolean
    const toast = useToast()

    if (requiresAuth && !token) {
      toast.add({ title: 'Acceso denegado', description: 'Inicia sesión para acceder a la aplicación' })
      return next({ name: 'Login' })
    }

    next()
  })
}
