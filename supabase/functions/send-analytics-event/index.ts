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
    const { config, eventName, eventData } = await req.json()
    
    if (!config.measurement_id) {
      throw new Error('Measurement ID is required')
    }

    // Get API secret from Supabase secrets
    const apiSecret = Deno.env.get('GOOGLE_ANALYTICS_API_SECRET')
    if (!apiSecret) {
      console.warn('Google Analytics API Secret not configured')
      return new Response(
        JSON.stringify({ success: false, message: 'API Secret not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Generate client ID (should be consistent per user)
    const clientId = eventData.client_id || `${Date.now()}.${Math.random().toString(36).substr(2, 9)}`
    
    const payload = {
      client_id: clientId,
      events: [{
        name: eventName,
        params: {
          ...eventData,
          // Ensure we have session ID for deduplication
          session_id: eventData.session_id || Date.now().toString(),
          engagement_time_msec: eventData.engagement_time_msec || 100
        }
      }]
    }

    // Send to Google Analytics Measurement Protocol v4
    const response = await fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${config.measurement_id}&api_secret=${apiSecret}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      }
    )

    if (response.ok) {
      return new Response(
        JSON.stringify({ success: true, message: 'Analytics event sent successfully' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else {
      const error = await response.text()
      console.error('Google Analytics error:', error)
      return new Response(
        JSON.stringify({ success: false, message: `Analytics error: ${error}` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
  } catch (error) {
    console.error('Analytics event error:', error)
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})