
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
    const { session_token, query, action, data, id, filters } = await req.json()

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

    // Проверяем сессию администратора
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
      return new Response(
        JSON.stringify({ error: 'Недействительная сессия' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401 
        }
      )
    }

    let result;

    switch (action) {
      case 'select':
        let selectQuery = supabaseClient
          .from(query)
          .select('*')
          .order('created_at', { ascending: false })
        
        // Handle filters
        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            selectQuery = selectQuery.eq(key, value)
          })
        }
        
        const { data: selectData, error: selectError } = await selectQuery
        
        if (selectError) throw selectError
        result = selectData
        break

      case 'insert':
        const { data: insertData, error: insertError } = await supabaseClient
          .from(query)
          .insert(data)
          .select()
        
        if (insertError) throw insertError
        result = insertData
        break

      case 'update':
        const { data: updateData, error: updateError } = await supabaseClient
          .from(query)
          .update(data)
          .eq('id', id)
          .select()
        
        if (updateError) throw updateError
        result = updateData
        break

      case 'upsert':
        // Специальная логика для upsert based on setting_key для seo_settings
        if (query === 'seo_settings' && data.setting_key) {
          const { data: existingData, error: checkError } = await supabaseClient
            .from('seo_settings')
            .select('id')
            .eq('setting_key', data.setting_key)
            .maybeSingle()

          if (checkError && checkError.code !== 'PGRST116') {
            throw checkError
          }

          if (existingData) {
            // Update existing
            const { data: updateData, error: updateError } = await supabaseClient
              .from('seo_settings')
              .update({
                setting_value: data.setting_value,
                is_active: data.is_active,
                updated_at: new Date().toISOString()
              })
              .eq('setting_key', data.setting_key)
              .select()
            
            if (updateError) throw updateError
            result = updateData
          } else {
            // Insert new
            const { data: insertData, error: insertError } = await supabaseClient
              .from('seo_settings')
              .insert(data)
              .select()
            
            if (insertError) throw insertError
            result = insertData
          }
        } else if (query === 'integrations' && data.name) {
          // Специальная логика для upsert based on name для integrations
          const { data: existingData, error: checkError } = await supabaseClient
            .from('integrations')
            .select('id')
            .eq('name', data.name)
            .maybeSingle()

          if (checkError && checkError.code !== 'PGRST116') {
            throw checkError
          }

          if (existingData) {
            // Update existing
            const { data: updateData, error: updateError } = await supabaseClient
              .from('integrations')
              .update({
                config: data.config,
                is_active: data.is_active,
                updated_at: new Date().toISOString()
              })
              .eq('name', data.name)
              .select()
            
            if (updateError) throw updateError
            result = updateData
          } else {
            // Insert new
            const { data: insertData, error: insertError } = await supabaseClient
              .from('integrations')
              .insert(data)
              .select()
            
            if (insertError) throw insertError
            result = insertData
          }
        } else {
          // Standard upsert
          const { data: upsertData, error: upsertError } = await supabaseClient
            .from(query)
            .upsert(data)
            .select()
          
          if (upsertError) throw upsertError
          result = upsertData
        }
        break

      case 'delete':
        const { data: deleteData, error: deleteError } = await supabaseClient
          .from(query)
          .delete()
          .eq('id', id)
          .select()
        
        if (deleteError) throw deleteError
        result = deleteData
        break

      default:
        throw new Error('Неподдерживаемое действие')
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        data: result
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Admin query error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
