import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface FacebookPixelConfig {
  access_token: string;
  pixel_id: string;
}

// Function to send Facebook Pixel event
const sendFacebookEvent = async (
  config: FacebookPixelConfig, 
  eventName: string, 
  eventData: any = {}
) => {
  try {
    const eventId = `${eventName}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const payload = {
      data: [{
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        action_source: 'website',
        user_data: {
          client_ip_address: await getClientIP(),
          client_user_agent: navigator.userAgent,
          ...eventData.user_data
        },
        custom_data: {
          ...eventData.custom_data
        }
      }]
    };

    const response = await fetch(`https://graph.facebook.com/v22.0/${config.pixel_id}/events?access_token=${config.access_token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      console.error('Facebook Pixel error:', await response.text());
    }
  } catch (error) {
    console.error('Error sending Facebook event:', error);
  }
};

// Get client IP (simplified)
const getClientIP = async () => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch {
    return undefined;
  }
};

export const useFacebookPixel = () => {
  useEffect(() => {
    const loadFacebookConfig = async () => {
      try {
        const { data: integrations } = await supabase
          .from('integrations')
          .select('*')
          .eq('name', 'facebook_capi')
          .eq('is_active', true)
          .maybeSingle();

        if (integrations?.config && 
            typeof integrations.config === 'object' &&
            integrations.config !== null &&
            'access_token' in integrations.config &&
            'pixel_id' in integrations.config) {
          // Send PageView event when component mounts
          sendFacebookEvent(integrations.config as unknown as FacebookPixelConfig, 'PageView', {
            custom_data: {
              content_name: document.title,
              content_category: 'Page View'
            }
          });
        }
      } catch (error) {
        console.error('Error loading Facebook config:', error);
      }
    };

    loadFacebookConfig();
  }, []);

  const trackEvent = async (eventName: string, eventData: any = {}) => {
    try {
      const { data: integrations } = await supabase
        .from('integrations')
        .select('*')
        .eq('name', 'facebook_capi')
        .eq('is_active', true)
        .maybeSingle();

      if (integrations?.config && 
          typeof integrations.config === 'object' &&
          integrations.config !== null &&
          'access_token' in integrations.config &&
          'pixel_id' in integrations.config) {
        await sendFacebookEvent(integrations.config as unknown as FacebookPixelConfig, eventName, eventData);
      }
    } catch (error) {
      console.error('Error tracking Facebook event:', error);
    }
  };

  return { trackEvent };
};