import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  "YOUR_PROJECT_URL",
  "YOUR_ANON_KEY"
)

export default supabase


let { data, error } = await supabase.from("users").select("*")

