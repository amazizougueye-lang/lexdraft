import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://klszeubrciktqfpgyjjz.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtsc3pldWJyY2lrdHFmcGd5amp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3MzAzMDIsImV4cCI6MjA5MDMwNjMwMn0.DmDzcJqUuEj7hwWrM0WpQk2kxPbe_8ByDkxJ1t-7Tus'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export const N8N_WEBHOOK = 'https://lexd-raft.app.n8n.cloud/webhook/lexdraft-med'
