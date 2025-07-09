
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
    const { orderData } = await req.json()
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Получаем настройки интеграций
    const { data: integrations } = await supabaseClient
      .from('integrations')
      .select('*')
      .eq('is_active', true)

    const results = []

    for (const integration of integrations || []) {
      if (integration.name === 'telegram') {
        const result = await sendTelegramNotification(integration.config, orderData)
        results.push({ service: 'telegram', success: result.success, message: result.message })
      } else if (integration.name === 'facebook_capi') {
        const result = await sendFacebookEvent(integration.config, orderData)
        results.push({ service: 'facebook', success: result.success, message: result.message })
      }
    }

    return new Response(
      JSON.stringify({ results }),
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
        status: 400 
      }
    )
  }
})

async function sendTelegramNotification(config: any, orderData: any) {
  try {
    const { bot_token, chat_id } = config
    
    if (!bot_token || !chat_id) {
      return { success: false, message: 'Telegram configuration incomplete' }
    }

    const message = `
🔔 *Nueva Consulta - Madiluxe*

👤 *Cliente:* ${orderData.customer_name}
📧 *Email:* ${orderData.customer_email}
📱 *Teléfono:* ${orderData.customer_phone || 'No proporcionado'}
🏠 *Producto:* ${orderData.product_name || 'Consulta general'}
💬 *Mensaje:* ${orderData.message || 'Sin mensaje adicional'}

📅 *Fecha:* ${new Date().toLocaleString('es-ES')}
`

    const telegramUrl = `https://api.telegram.org/bot${bot_token}/sendMessage`
    
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chat_id,
        text: message,
        parse_mode: 'Markdown'
      })
    })

    if (response.ok) {
      return { success: true, message: 'Telegram notification sent successfully' }
    } else {
      const error = await response.text()
      return { success: false, message: `Telegram error: ${error}` }
    }
  } catch (error) {
    return { success: false, message: `Telegram error: ${error.message}` }
  }
}

async function sendFacebookEvent(config: any, orderData: any) {
  try {
    const { access_token, pixel_id } = config
    
    if (!access_token || !pixel_id) {
      return { success: false, message: 'Facebook configuration incomplete' }
    }

    // Generate event ID for deduplication
    const eventId = `${orderData.customer_email}_${Date.now()}`
    
    let eventName = 'Lead'
    if (orderData.product_name && orderData.product_name !== 'General Consultation') {
      eventName = orderData.customer_phone ? 'Purchase' : 'Contact'
    }
    
    const eventData = {
      data: [{
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        user_data: {
          em: [orderData.customer_email],
          ph: orderData.customer_phone ? [orderData.customer_phone.replace(/\D/g, '')] : undefined
        },
        custom_data: {
          content_name: orderData.product_name || 'General Consultation',
          content_category: eventName === 'Purchase' ? 'Purchase' : 'Lead Generation',
          value: eventName === 'Purchase' ? 10.00 : 1.00,
          currency: 'EUR'
        }
      }]
    }

    const facebookUrl = `https://graph.facebook.com/v22.0/${pixel_id}/events?access_token=${access_token}`
    
    const response = await fetch(facebookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData)
    })

    if (response.ok) {
      return { success: true, message: 'Facebook event sent successfully' }
    } else {
      const error = await response.text()
      return { success: false, message: `Facebook error: ${error}` }
    }
  } catch (error) {
    return { success: false, message: `Facebook error: ${error.message}` }
  }
}
