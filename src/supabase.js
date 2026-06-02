import { createClient } from '@supabase/supabase-js'

// Import Supabase credentials from .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

function isSupabaseConfigValid(url, key) {
  return Boolean(
    url && typeof url === 'string' && url.startsWith('http') &&
    key && typeof key === 'string' && !key.includes('your_supabase')
  )
}

let client
const supabaseConfigured = isSupabaseConfigValid(supabaseUrl, supabaseKey)

if (supabaseConfigured) {
  client = createClient(supabaseUrl, supabaseKey)
} else {
  console.warn('Supabase is not configured correctly. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.')
  client = {
    auth: {
      getSession: async () => ({ data: { session: null } }),
      signUp: async () => ({ data: null, error: { message: 'Supabase is not configured' } }),
      signInWithPassword: async () => ({ data: null, error: { message: 'Supabase is not configured' } }),
      signOut: async () => ({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
    },
  }
}

export const supabase = client
export const isSupabaseConfigured = supabaseConfigured
