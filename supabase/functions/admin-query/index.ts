
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
    const { session_token, query, action, data, id } = await req.json()

    if (!session_token) {
      return new Response(
        JSON.stringify({ success: false, error: 'Session token required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401 
        }
      )
    }

    // Создаем админский клиент с service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Проверяем валидность сессии администратора
    const { data: sessionData, error: sessionError } = await supabaseAdmin
      .from('admin_sessions')
      .select(`
        admin_id,
        expires_at,
        admins!inner(
          id,
          email,
          role,
          is_active
        )
      `)
      .eq('session_token', session_token)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (sessionError || !sessionData) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid or expired session' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401 
        }
      )
    }

    if (!sessionData.admins.is_active) {
      return new Response(
        JSON.stringify({ success: false, error: 'Admin account is disabled' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 403 
        }
      )
    }

    let result;

    // Выполняем запрос в зависимости от действия
    switch (action) {
      case 'select':
        if (query === 'customers') {
          const { data: customers, error } = await supabaseAdmin
            .from('customers')
            .select('*')
            .order('created_at', { ascending: false })
          
          if (error) throw error
          result = { success: true, data: customers }
        } else if (query === 'categories') {
          const { data: categories, error } = await supabaseAdmin
            .from('categories')
            .select('*')
            .order('created_at', { ascending: false })
          
          if (error) throw error
          result = { success: true, data: categories }
        } else if (query === 'products') {
          const { data: products, error } = await supabaseAdmin
            .from('products')
            .select(`
              *,
              categories (
                name,
                slug
              )
            `)
            .order('created_at', { ascending: false })
          
          if (error) throw error
          result = { success: true, data: products }
        } else if (query === 'orders') {
          const { data: orders, error } = await supabaseAdmin
            .from('orders')
            .select(`
              *,
              products (
                name,
                slug
              )
            `)
            .order('created_at', { ascending: false })
          
          if (error) throw error
          result = { success: true, data: orders }
        } else if (query === 'integrations') {
          const { data: integrations, error } = await supabaseAdmin
            .from('integrations')
            .select('*')
            .order('created_at', { ascending: false })
          
          if (error) throw error
          result = { success: true, data: integrations }
        } else if (query === 'admins') {
          // Только администраторы могут просматривать других администраторов
          if (sessionData.admins.role !== 'admin') {
            return new Response(
              JSON.stringify({ success: false, error: 'Access denied' }),
              { 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 403 
              }
            )
          }
          
          const { data: admins, error } = await supabaseAdmin
            .from('admins')
            .select('id, email, name, role, is_active, created_at')
            .order('created_at', { ascending: false })
          
          if (error) throw error
          result = { success: true, data: admins }
        }
        break

      case 'insert':
        if (query === 'customers') {
          const { data: customer, error } = await supabaseAdmin
            .from('customers')
            .insert([data])
            .select()
            .single()
          
          if (error) throw error
          result = { success: true, data: customer }
        } else if (query === 'categories') {
          const { data: category, error } = await supabaseAdmin
            .from('categories')
            .insert([data])
            .select()
            .single()
          
          if (error) throw error
          result = { success: true, data: category }
        } else if (query === 'products') {
          const { data: product, error } = await supabaseAdmin
            .from('products')
            .insert([data])
            .select()
            .single()
          
          if (error) throw error
          result = { success: true, data: product }
        } else if (query === 'orders') {
          const { data: order, error } = await supabaseAdmin
            .from('orders')
            .insert([data])
            .select()
            .single()
          
          if (error) throw error
          result = { success: true, data: order }
        } else if (query === 'integrations') {
          const { data: integration, error } = await supabaseAdmin
            .from('integrations')
            .insert([data])
            .select()
            .single()
          
          if (error) throw error
          result = { success: true, data: integration }
        } else if (query === 'admins') {
          // Только администраторы могут создавать других администраторов
          if (sessionData.admins.role !== 'admin') {
            return new Response(
              JSON.stringify({ success: false, error: 'Access denied' }),
              { 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 403 
              }
            )
          }
          
          const { data: admin, error } = await supabaseAdmin
            .from('admins')
            .insert([data])
            .select('id, email, name, role, is_active, created_at')
            .single()
          
          if (error) throw error
          result = { success: true, data: admin }
        }
        break

      case 'update':
        if (query === 'customers') {
          const { data: customer, error } = await supabaseAdmin
            .from('customers')
            .update(data)
            .eq('id', id)
            .select()
            .single()
          
          if (error) throw error
          result = { success: true, data: customer }
        } else if (query === 'categories') {
          const { data: category, error } = await supabaseAdmin
            .from('categories')
            .update(data)
            .eq('id', id)
            .select()
            .single()
          
          if (error) throw error
          result = { success: true, data: category }
        } else if (query === 'products') {
          const { data: product, error } = await supabaseAdmin
            .from('products')
            .update(data)
            .eq('id', id)
            .select()
            .single()
          
          if (error) throw error
          result = { success: true, data: product }
        } else if (query === 'orders') {
          const { data: order, error } = await supabaseAdmin
            .from('orders')
            .update(data)
            .eq('id', id)
            .select()
            .single()
          
          if (error) throw error
          result = { success: true, data: order }
        } else if (query === 'integrations') {
          const { data: integration, error } = await supabaseAdmin
            .from('integrations')
            .update(data)
            .eq('id', id)
            .select()
            .single()
          
          if (error) throw error
          result = { success: true, data: integration }
        } else if (query === 'admins') {
          // Только администраторы могут обновлять других администраторов
          if (sessionData.admins.role !== 'admin') {
            return new Response(
              JSON.stringify({ success: false, error: 'Access denied' }),
              { 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 403 
              }
            )
          }
          
          const { data: admin, error } = await supabaseAdmin
            .from('admins')
            .update(data)
            .eq('id', id)
            .select('id, email, name, role, is_active, created_at')
            .single()
          
          if (error) throw error
          result = { success: true, data: admin }
        }
        break

      case 'delete':
        if (query === 'customers') {
          const { error } = await supabaseAdmin
            .from('customers')
            .delete()
            .eq('id', id)
          
          if (error) throw error
          result = { success: true }
        } else if (query === 'categories') {
          const { error } = await supabaseAdmin
            .from('categories')
            .delete()
            .eq('id', id)
          
          if (error) throw error
          result = { success: true }
        } else if (query === 'products') {
          const { error } = await supabaseAdmin
            .from('products')
            .delete()
            .eq('id', id)
          
          if (error) throw error
          result = { success: true }
        } else if (query === 'orders') {
          const { error } = await supabaseAdmin
            .from('orders')
            .delete()
            .eq('id', id)
          
          if (error) throw error
          result = { success: true }
        } else if (query === 'integrations') {
          const { error } = await supabaseAdmin
            .from('integrations')
            .delete()
            .eq('id', id)
          
          if (error) throw error
          result = { success: true }
        } else if (query === 'admins') {
          // Только администраторы могут удалять других администраторов
          if (sessionData.admins.role !== 'admin') {
            return new Response(
              JSON.stringify({ success: false, error: 'Access denied' }),
              { 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 403 
              }
            )
          }
          
          // Нельзя удалить самого себя
          if (id === sessionData.admin_id) {
            return new Response(
              JSON.stringify({ success: false, error: 'Cannot delete your own account' }),
              { 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400 
              }
            )
          }
          
          const { error } = await supabaseAdmin
            .from('admins')
            .delete()
            .eq('id', id)
          
          if (error) throw error
          result = { success: true }
        }
        break

      default:
        throw new Error('Invalid action')
    }

    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Admin query error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Internal server error' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
