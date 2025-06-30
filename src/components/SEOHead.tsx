
import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'product' | 'article';
  price?: string;
  availability?: 'in stock' | 'out of stock' | 'preorder';
  category?: string;
}

const SEOHead = ({ 
  title = "MADI - Mobiliario de Autor Exclusivo",
  description = "MADI - Creamos mobiliario de autor exclusivo y a medida. Cocinas, vestidores y armarios de lujo diseñados en Madrid con la más alta calidad artesanal.",
  keywords = "mobiliario de lujo, cocinas a medida, vestidores personalizados, armarios de diseño, muebles exclusivos Madrid, mobiliario artesanal",
  image = "/lovable-uploads/52fb3c8e-ed45-4620-a143-5f46300b53b1.png",
  url = "https://madiluxe.com",
  type = "website",
  price,
  availability,
  category
}: SEOHeadProps) => {
  
  useEffect(() => {
    // Update title
    document.title = title;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }
    
    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', keywords);
    }
    
    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.setAttribute('content', description);
    
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) ogImage.setAttribute('content', image);
    
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', url);
    
    const ogType = document.querySelector('meta[property="og:type"]');
    if (ogType) ogType.setAttribute('content', type);
    
    // Update Twitter tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute('content', title);
    
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) twitterDescription.setAttribute('content', description);
    
    const twitterImage = document.querySelector('meta[name="twitter:image"]');
    if (twitterImage) twitterImage.setAttribute('content', image);
    
    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);
    
    // Add product-specific schema markup for products
    if (type === 'product' && price && availability && category) {
      const existingSchema = document.querySelector('#product-schema');
      if (existingSchema) {
        existingSchema.remove();
      }
      
      const schema = document.createElement('script');
      schema.id = 'product-schema';
      schema.type = 'application/ld+json';
      schema.textContent = JSON.stringify({
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": title,
        "description": description,
        "image": image,
        "brand": {
          "@type": "Brand",
          "name": "MADI"
        },
        "category": category,
        "offers": {
          "@type": "Offer",
          "url": url,
          "priceCurrency": "EUR",
          "price": price.replace(/[^\d.,]/g, ''),
          "availability": `https://schema.org/${availability === 'in stock' ? 'InStock' : availability === 'out of stock' ? 'OutOfStock' : 'PreOrder'}`,
          "seller": {
            "@type": "Organization",
            "name": "MADI Luxury Design"
          }
        }
      });
      document.head.appendChild(schema);
    }
    
  }, [title, description, keywords, image, url, type, price, availability, category]);

  return null;
};

export default SEOHead;
