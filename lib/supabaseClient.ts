import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

const supabaseMissingConfig = !supabaseUrl || !supabaseAnonKey

const supabase = supabaseMissingConfig
  ? null
  : createClient(supabaseUrl, supabaseAnonKey)

if (typeof window !== 'undefined' && supabaseMissingConfig) {
  console.warn('[Supabase] Missing configuration. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.')
}

export { supabase }
