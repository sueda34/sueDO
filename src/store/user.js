import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../supabase.js'

// Pinia store to manage user state
export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const loading = ref(true)

  // Check if user is logged in
  const isAuthenticated = computed(() => !!user.value)

  // Get current user from Supabase session
  async function fetchUser() {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      user.value = session?.user || null
    } catch (error) {
      console.error('Error fetching user:', error)
      user.value = null
    } finally {
      loading.value = false
    }
  }

  // Sign out the user
  async function signOut() {
    try {
      await supabase.auth.signOut()
      user.value = null
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  // Listen for auth state changes in real-time
  supabase.auth.onAuthStateChange((event, session) => {
    user.value = session?.user || null
  })

  return {
    user,
    loading,
    isAuthenticated,
    fetchUser,
    signOut
  }
})
