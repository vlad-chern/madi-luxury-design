import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface GoogleAnalyticsConfig {
  measurement_id?: string;
  container_id?: string;
}

interface EcommerceEvent {
  currency: string;
  value: number;
  items?: Array<{
    item_id?: string;
    item_name?: string;
    item_category?: string;
    quantity?: number;
    price?: number;
  }>;
}

// Function to load Google Analytics script
const loadGoogleAnalytics = (measurementId: string, containerId?: string) => {
  // Load Google Analytics 4
  if (!document.querySelector(`script[src*="${measurementId}"]`)) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    // Initialize gtag
    (window as any).dataLayer = (window as any).dataLayer || [];
    function gtag(...args: any[]) {
      (window as any).dataLayer.push(args);
    }
    (window as any).gtag = gtag;

    gtag('js', new Date());
    gtag('config', measurementId, {
      send_page_view: true
    });
  }

  // Load Google Tag Manager if container ID is provided
  if (containerId && !document.querySelector(`script[src*="${containerId}"]`)) {
    const gtmScript = document.createElement('script');
    gtmScript.innerHTML = `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${containerId}');
    `;
    document.head.appendChild(gtmScript);

    // Add GTM noscript fallback
    const noscript = document.createElement('noscript');
    noscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${containerId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
    document.body.appendChild(noscript);
  }
};

// Function to send events to Google Analytics Measurement Protocol
const sendGoogleAnalyticsEvent = async (
  config: GoogleAnalyticsConfig,
  eventName: string,
  eventData: any = {}
) => {
  if (!config.measurement_id) return;

  try {
    const eventId = `${eventName}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Get client ID from GA4 if available
    let clientId = 'anonymous';
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('get', config.measurement_id, 'client_id', (id: string) => {
        clientId = id;
      });
    }

    const params = new URLSearchParams({
      measurement_id: config.measurement_id,
      api_secret: 'your-api-secret', // This should be stored in Supabase secrets
    });

    const payload = {
      client_id: clientId,
      events: [{
        name: eventName,
        params: {
          event_id: eventId, // For deduplication
          ...eventData
        }
      }]
    };

    // Send to Measurement Protocol (this should be done via Edge Function for security)
    await supabase.functions.invoke('send-analytics-event', {
      body: {
        config,
        eventName,
        eventData: {
          ...eventData,
          event_id: eventId
        }
      }
    });

  } catch (error) {
    console.error('Error sending Google Analytics event:', error);
  }
};

export const useGoogleAnalytics = () => {
  useEffect(() => {
    const loadAnalyticsConfig = async () => {
      try {
        const { data: integrations } = await supabase
          .from('integrations')
          .select('*')
          .eq('name', 'analytics')
          .eq('is_active', true)
          .maybeSingle();

        if (integrations?.config && 
            typeof integrations.config === 'object' &&
            integrations.config !== null &&
            'measurement_id' in integrations.config) {
          
          const config = integrations.config as unknown as GoogleAnalyticsConfig;
          
          if (config.measurement_id) {
            loadGoogleAnalytics(config.measurement_id, config.container_id);
            
            // Send initial page view
            trackEvent('page_view', {
              page_title: document.title,
              page_location: window.location.href
            });
          }
        }
      } catch (error) {
        console.error('Error loading Google Analytics config:', error);
      }
    };

    loadAnalyticsConfig();
  }, []);

  const trackEvent = async (eventName: string, eventData: any = {}) => {
    try {
      const { data: integrations } = await supabase
        .from('integrations')
        .select('*')
        .eq('name', 'analytics')
        .eq('is_active', true)
        .maybeSingle();

      if (integrations?.config && 
          typeof integrations.config === 'object' &&
          integrations.config !== null &&
          'measurement_id' in integrations.config) {
        
        const config = integrations.config as unknown as GoogleAnalyticsConfig;

        // Send event via standard GA4 (gtag)
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', eventName, eventData);
        }

        // Send event via Measurement Protocol for deduplication
        await sendGoogleAnalyticsEvent(config, eventName, eventData);
      }
    } catch (error) {
      console.error('Error tracking Google Analytics event:', error);
    }
  };

  const trackEcommerce = async (eventName: 'purchase' | 'begin_checkout' | 'add_to_cart' | 'view_item', eventData: EcommerceEvent) => {
    await trackEvent(eventName, eventData);
  };

  const trackFormSubmit = async (formName: string, additionalData: any = {}) => {
    await trackEvent('form_submit', {
      form_name: formName,
      ...additionalData
    });
  };

  return { trackEvent, trackEcommerce, trackFormSubmit };
};