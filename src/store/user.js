import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../supabase.js'

// Pinia store to manage user authentication state
export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const loading = ref(true)
  const error = ref(null)

  const isAuthenticated = computed(() => !!user.value)

  async function fetchUser() {
    loading.value = true
    error.value = null

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError) throw sessionError
      user.value = session?.user ?? null
    } catch (fetchError) {
      console.error('Error fetching user:', fetchError)
      user.value = null
      error.value = fetchError
    } finally {
      loading.value = false
    }
  }

  async function signIn(email, password) {
    loading.value = true
    error.value = null

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (authError) throw authError
      user.value = data.user ?? null
      return data
    } catch (signInError) {
      error.value = signInError
      throw signInError
    } finally {
      loading.value = false
    }
  }

  async function signUp(email, password) {
    loading.value = true
    error.value = null

    try {
      const { data, error: authError } = await supabase.auth.signUp(
        {
          email,
          password
        },
        {
          options: {
            emailRedirectTo: `${window.location.origin}/`
          }
        }
      )

      if (authError) throw authError
      user.value = data.user ?? user.value
      return data
    } catch (signUpError) {
      error.value = signUpError
      throw signUpError
    } finally {
      loading.value = false
    }
  }

  async function signOut() {
    loading.value = true
    error.value = null

    try {
      await supabase.auth.signOut()
      user.value = null
    } catch (signOutError) {
      console.error('Error signing out:', signOutError)
      error.value = signOutError
      throw signOutError
    } finally {
      loading.value = false
    }
  }

  supabase.auth.onAuthStateChange((event, session) => {
    user.value = session?.user || null
  })

  return {
    user,
    loading,
    error,
    isAuthenticated,
    fetchUser,
    signIn,
    signUp,
    signOut
  }
}, {
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'user-store',
        storage: localStorage,
        paths: ['user']
      }
    ]
  }
})
