import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../views/LoginPage.vue'
import DashboardPage from '../views/DashboardPage.vue'
import NotFoundPage from '../views/NotFoundPage.vue'
import { useAuthStore } from '../stores/auth'

const routes = [
  { path: '/', name: 'Login', component: LoginPage },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/tasks',
    name: 'Tasks',
    component: DashboardPage,
    meta: { requiresAuth: true },
  },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()

  // garante que a sessão seja carregada antes de decidir
  if (!auth.user && !auth.loading) {
    await auth.init()
  }

  if (to.meta.requiresAuth && !auth.user) {
    return next({ name: 'Login' })
  }

  // se já está logado, não faz sentido ficar na tela de login
  if (to.name === 'Login' && auth.user) {
    return next({ name: 'Dashboard' })
  }

  return next()
})

export default router
