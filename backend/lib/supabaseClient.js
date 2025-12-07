const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('[supabaseClient] URL:', supabaseUrl)

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

module.exports = supabase
