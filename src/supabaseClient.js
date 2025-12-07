import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lxrqcqagnusnabpvuugx.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4cnFjcWFnbnVzbmFicHZ1dWd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwNDEwOTksImV4cCI6MjA4MDYxNzA5OX0.LfkRXsYsvi7xarfrTMV3j-hECl33HKWkA48J6w7EI-E'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
