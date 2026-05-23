<template>
  <section>
    <router-view class="app-main" />
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useUserStore } from './store/user.js'

const router = useRouter()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

onMounted(async () => {
  try {
    await userStore.fetchUser()
    if (!user.value) {
      router.push({ path: '/auth' });
    } else {
      router.push({ path: '/' });
    }
  } catch (e) {
    console.error(e)
  }
})
</script>