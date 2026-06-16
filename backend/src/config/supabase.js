const { createClient } = require('@supabase/supabase-js');

const rawUrl = process.env.SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!process.env.SUPABASE_URL) {
  console.error('CRITICAL: SUPABASE_URL environment variable is missing.');
}

const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey || 'placeholder-anon-key'
);

const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceRoleKey || supabaseAnonKey || 'placeholder-service-key'
);

module.exports = {
  supabase,
  supabaseAdmin
};
