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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Получаем активные продукты с категориями
    const { data: products, error } = await supabaseClient
      .from('products')
      .select(`
        id,
        name,
        slug,
        description,
        price_from,
        price_fixed,
        price_type,
        images,
        categories (
          name,
          slug
        )
      `)
      .eq('is_active', true)

    if (error) throw error

    // Генерируем Google Merchant XML
    const googleMerchantXML = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>MADI - Mobiliario de Autor</title>
    <link>https://madi.florexa.site</link>
    <description>Mobiliario exclusivo y a medida</description>
    ${products?.map(product => `
    <item>
      <g:id>${product.id}</g:id>
      <g:title><![CDATA[${product.name}]]></g:title>
      <g:description><![CDATA[${product.description || ''}]]></g:description>
      <g:link>https://madi.florexa.site/product/${product.slug}</g:link>
      <g:image_link>${product.images && product.images.length > 0 ? product.images[0] : 'https://madi.florexa.site/placeholder.jpg'}</g:image_link>
      <g:condition>new</g:condition>
      <g:availability>in_stock</g:availability>
      <g:price>${product.price_type === 'fixed' && product.price_fixed 
        ? `${product.price_fixed} EUR`
        : product.price_from 
        ? `${product.price_from} EUR`
        : '0 EUR'}</g:price>
      <g:brand>MADI</g:brand>
      <g:product_type>${product.categories?.name || 'Mobiliario'}</g:product_type>
      <g:google_product_category>Home &amp; Garden &gt; Furniture</g:google_product_category>
    </item>
    `).join('')}
  </channel>
</rss>`

    console.log(`Generated XML feed for ${products?.length || 0} products`)

    return new Response(
      googleMerchantXML,
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/xml',
          'Content-Disposition': 'inline; filename="products.xml"'
        },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error generating XML feed:', error)
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
<error>
  <message>${error.message}</message>
</error>`,
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/xml' },
        status: 400 
      }
    )
  }
})