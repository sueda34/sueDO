import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../pages/Dashboard.vue';
import Signup from '../pages/Signup.vue';
import Login from '../pages/Login.vue';
import { useUserStore } from '../store/user.js'

const routes = [
  { path: '/', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/login', component: Login, meta: { guestOnly: true } },
  { path: '/signup', component: Signup, meta: { guestOnly: true } },
  { path: '/:pathMatch(.*)*', redirect: '/login' }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Global navigation guard to protect routes
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()

  // Ensure we have fetched the current user
  if (userStore.loading) {
    await userStore.fetchUser()
  } else if (!userStore.user) {
    // Try one fetch if no user yet
    await userStore.fetchUser()
  }

  const isAuth = !!userStore.user

  if (to.meta.requiresAuth && !isAuth) {
    return next({ path: '/login' })
  }

  if (to.meta.guestOnly && isAuth) {
    return next({ path: '/' })
  }

  return next()
})

export default router;