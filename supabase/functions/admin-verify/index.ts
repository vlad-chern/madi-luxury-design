
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { session_token } = await req.json()

    if (!session_token) {
      return new Response(
        JSON.stringify({ error: 'Токен сессии отсутствует' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401 
        }
      )
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Проверяем сессию
    const { data: session, error: sessionError } = await supabaseClient
      .from('admin_sessions')
      .select(`
        *,
        admins (
          id,
          email,
          name,
          role,
          is_active
        )
      `)
      .eq('session_token', session_token)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle()

    if (sessionError || !session || !session.admins?.is_active) {
      console.log('Session verification failed:', sessionError || 'Invalid session or inactive admin')
      return new Response(
        JSON.stringify({ error: 'Недействительная сессия' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401 
        }
      )
    }

    console.log('Admin verified successfully:', session.admins.email)

    return new Response(
      JSON.stringify({ 
        success: true,
        admin: {
          id: session.admins.id,
          email: session.admins.email,
          name: session.admins.name,
          role: session.admins.role
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Admin verification error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
