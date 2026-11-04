import { createClient } from '@supabase/supabase-js'

// Public static builds use bundled, reviewed data. A private database key must
// never be passed through Vite: VITE_ values are embedded in browser JavaScript.
// A future read-only adapter can replace this disabled client after its API and
// permissions have been independently verified.
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ?? 'https://vbidhkvzjigatfygnycg.supabase.co'
const SUPABASE_ANON_KEY = 'public-data-view-disabled'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
export const SUPABASE_PROJECT_URL = SUPABASE_URL
