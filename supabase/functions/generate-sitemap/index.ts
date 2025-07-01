
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

    // Получаем все активные категории
    const { data: categories, error: categoriesError } = await supabaseClient
      .from('categories')
      .select('slug, updated_at')
      .order('updated_at', { ascending: false })

    if (categoriesError) {
      throw categoriesError
    }

    // Получаем все активные продукты
    const { data: products, error: productsError } = await supabaseClient
      .from('products')
      .select(`
        slug,
        updated_at,
        categories!inner (slug)
      `)
      .eq('is_active', true)
      .order('updated_at', { ascending: false })

    if (productsError) {
      throw productsError
    }

    // Генерируем XML sitemap
    const baseUrl = 'https://madiluxe.com'
    const currentDate = new Date().toISOString()

    let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`

    // Добавляем категории
    for (const category of categories || []) {
      sitemapXml += `
  <url>
    <loc>${baseUrl}/category/${category.slug}</loc>
    <lastmod>${category.updated_at}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`
    }

    // Добавляем продукты
    for (const product of products || []) {
      sitemapXml += `
  <url>
    <loc>${baseUrl}/product/${product.categories.slug}/${product.slug}</loc>
    <lastmod>${product.updated_at}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
    }

    sitemapXml += `
</urlset>`

    // Сохраняем sitemap в настройках SEO
    const { error: saveError } = await supabaseClient
      .from('seo_settings')
      .upsert({
        setting_key: 'sitemap_xml',
        setting_value: sitemapXml,
        is_active: true
      })

    if (saveError) {
      console.error('Error saving sitemap:', saveError)
      throw saveError
    }

    console.log('Sitemap generated successfully')

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Sitemap generated successfully',
        urls_count: (categories?.length || 0) + (products?.length || 0) + 2
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Sitemap generation error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
