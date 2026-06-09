<template>
  <v-main class="pa-8">
    <v-container class="fill-height d-flex justify-center align-center">
      <v-card width="420" class="pa-6 elevation-4">
        <v-card-title class="text-center mb-4">Sign Up</v-card-title>

        <v-alert v-if="message" :type="message.type" class="mb-4" closable>
          {{ message.text }}
        </v-alert>

        <v-form @submit.prevent="handleSignup">
          <v-text-field
            v-model="email"
            label="Email"
            type="email"
            outlined
            dense
            required
            class="mb-3"
          />

          <v-text-field
            v-model="password"
            label="Password"
            type="password"
            outlined
            dense
            required
            class="mb-3"
          />

          <v-text-field
            v-model="confirmPassword"
            label="Confirm Password"
            type="password"
            outlined
            dense
            required
            class="mb-4"
          />

          <v-btn type="submit" color="primary" block :disabled="loading">
            {{ loading ? 'Registering...' : 'Register' }}
          </v-btn>
        </v-form>

        <v-card-text class="mt-3 text-center text-sm">
          Passwords must be the same in both boxes.
        </v-card-text>

        <v-card-actions class="justify-center mt-4">
          <span>Already have an account?</span>
          <v-btn text color="primary" @click="goLogin">Log In</v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </v-main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../store/user.js'

const router = useRouter()
const userStore = useUserStore()
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const message = ref(null)

// simple check that email includes @
function validateEmail(value) {
  return value && value.includes('@')
}

function validateForm() {
  if (!email.value) {
    message.value = { type: 'error', text: 'Email is required' }
    return false
  }

  if (!validateEmail(email.value)) {
    message.value = { type: 'error', text: 'Please enter a valid email' }
    return false
  }

  if (!password.value) {
    message.value = { type: 'error', text: 'Password is required' }
    return false
  }

  if (password.value.length < 6) {
    message.value = { type: 'error', text: 'Password must be at least 6 characters' }
    return false
  }

  if (password.value !== confirmPassword.value) {
    message.value = { type: 'error', text: 'Passwords do not match' }
    return false
  }

  return true
}

async function handleSignup() {
  if (!validateForm()) return

  loading.value = true
  message.value = null

  try {
    await userStore.signUp(email.value, password.value)
    message.value = {
      type: 'success',
      text: 'Please check your email and click the confirmation link.'
    }
    email.value = ''
    password.value = ''
    confirmPassword.value = ''
  } catch (error) {
    message.value = { type: 'error', text: error.message }
  } finally {
    loading.value = false
  }
}

function goLogin() {
  router.push('/login')
}
</script>
