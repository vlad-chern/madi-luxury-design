
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
    const { email, password } = await req.json()

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Получаем администратора по email
    const { data: admin, error: adminError } = await supabaseClient
      .from('admins')
      .select('*')
      .eq('email', email)
      .eq('is_active', true)
      .maybeSingle()

    if (adminError || !admin) {
      return new Response(
        JSON.stringify({ error: 'Неверные учетные данные' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401 
        }
      )
    }

    // Проверяем пароль (простая проверка, в реальном проекте лучше использовать bcrypt)
    if (password !== '4gh378f') {
      return new Response(
        JSON.stringify({ error: 'Неверные учетные данные' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401 
        }
      )
    }

    // Создаем токен сессии
    const sessionToken = crypto.randomUUID()
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24) // Сессия на 24 часа

    // Сохраняем сессию
    const { error: sessionError } = await supabaseClient
      .from('admin_sessions')
      .insert({
        admin_id: admin.id,
        session_token: sessionToken,
        expires_at: expiresAt.toISOString()
      })

    if (sessionError) {
      throw sessionError
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        session_token: sessionToken,
        admin: {
          id: admin.id,
          email: admin.email,
          name: admin.name
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
