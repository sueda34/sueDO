<template>
  <v-main class="pa-8">
    <v-container class="fill-height d-flex justify-center align-center">
      <v-card width="420" class="pa-6 elevation-4">
        <v-card-title class="text-center mb-4">Log In</v-card-title>

        <v-alert v-if="message" :type="message.type" class="mb-4" closable>
          {{ message.text }}
        </v-alert>

        <v-form @submit.prevent="handleLogin">
          <v-card-text class="mb-2 text-sm">
            Enter the email and password you used when signing up.
          </v-card-text>
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
            class="mb-4"
          />

          <v-btn type="submit" color="primary" block :disabled="loading">
            {{ loading ? 'Signing in...' : 'Log In' }}
          </v-btn>
        </v-form>

        <v-card-actions class="justify-center mt-4">
          <span>New here?</span>
          <v-btn text color="primary" @click="goSignup">Create account</v-btn>
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
const loading = ref(false)
const message = ref(null)

// very small validation for email field
function validateEmail(value) {
  return value && value.includes('@')
}

function getErrorMessage(error) {
  if (!error) return 'Ein unerwarteter Fehler ist aufgetreten.'
  const message = error.message?.toLowerCase() || ''

  if (message.includes('email not confirmed') || message.includes('email not verified')) {
    return 'E-Mail nicht bestätigt. Bitte überprüfe dein Postfach und bestätige den Link.'
  }

  if (message.includes('invalid login credentials') || message.includes('invalid login')) {
    return 'Ungültige Login-Daten. Bitte überprüfe deine E-Mail-Adresse und dein Passwort.'
  }

  return error.message || 'Ein unerwarteter Fehler ist aufgetreten.'
}

async function handleLogin() {
  if (!email.value || !password.value) {
    message.value = { type: 'error', text: 'Please fill in all fields' }
    return
  }

  if (!validateEmail(email.value)) {
    message.value = { type: 'error', text: 'Please enter a valid email' }
    return
  }

  loading.value = true
  message.value = null

  try {
    await userStore.signIn(email.value, password.value)
    router.push('/')
  } catch (error) {
    message.value = { type: 'error', text: getErrorMessage(error) }
  } finally {
    loading.value = false
  }
}

function goSignup() {
  router.push('/signup')
}
</script>
