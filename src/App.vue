<template>
  <v-app>
    <router-view v-if="!userStore.loading" />
    <v-main v-else class="d-flex justify-center align-center">
      <v-progress-circular indeterminate color="primary" />
    </v-main>
  </v-app>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from './store/user.js'

const router = useRouter()
const userStore = useUserStore()

// Check if user is logged in when app loads
// If not, keep login/signup open or send them to the correct page
onMounted(async () => {
  await userStore.fetchUser()

  const current = router.currentRoute.value.path
  const isGuestRoute = ['/login', '/signup'].includes(current)

  if (!userStore.user) {
    if (!isGuestRoute) {
      router.push('/login')
    }
  } else if (current !== '/') {
    router.push('/')
  }
})
</script>