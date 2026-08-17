import { useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';

const SEOMetadata = () => {
  const { t, language } = useTranslation();

  useEffect(() => {
    // Structured Data for Organization
    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "BluNet IT Services",
      "description": t('seo.description'),
      "url": "https://blunetitservices.in",
      "logo": "https://blunetitservices.in/logo.png",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "No.27, 2nd Floor, Sriranga Complex, 2nd Cross Road, Modi Hospital Road",
        "addressLocality": "Rajajinagar",
        "addressRegion": "Karnataka",
        "postalCode": "560086",
        "addressCountry": "IN"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "Customer Service",
        "areaServed": "IN",
        "availableLanguage": ["English", "Hindi", "Kannada"]
      },
      "sameAs": [
        "https://linkedin.com/company/blunet-it-services",
        "https://twitter.com/blunetitservices",
        "https://instagram.com/blunetitservices"
      ],
      "foundingDate": "2014",
      "numberOfEmployees": "50-100",
      "industry": "Information Technology",
      "serviceType": [
        "Software Development",
        "Web Development",
        "Mobile App Development",
        "Cybersecurity",
        "Cloud Solutions",
        "AI Development",
        "Student Training"
      ]
    };

    // Update structured data to head
    const addStructuredData = (schema: object, id: string) => {
      const existingScript = document.getElementById(id) as HTMLScriptElement | null;
      if (existingScript) {
        existingScript.textContent = JSON.stringify(schema);
      } else {
        const newScript = document.createElement('script');
        newScript.id = id;
        newScript.type = 'application/ld+json';
        newScript.textContent = JSON.stringify(schema);
        document.head.appendChild(newScript);
      }
    };

    addStructuredData(organizationSchema, 'organization-schema');

    // Update meta tags
    const updateMetaTag = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`) || 
                 document.querySelector(`meta[name="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        if (property.startsWith('og:') || property.startsWith('twitter:')) {
          meta.setAttribute('property', property);
        } else {
          meta.setAttribute('name', property);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Update essential meta tags based on active language
    updateMetaTag('description', t('seo.description'));
    updateMetaTag('keywords', t('seo.keywords'));
    updateMetaTag('og:title', t('seo.ogTitle'));
    updateMetaTag('og:description', t('seo.ogDescription'));
    updateMetaTag('og:type', 'website');
    updateMetaTag('og:url', window.location.href);
    updateMetaTag('og:image', 'https://blunetitservices.in/logo.png');
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', t('seo.ogTitle'));
    updateMetaTag('twitter:description', t('seo.ogDescription'));
    updateMetaTag('twitter:image', 'https://blunetitservices.in/logo.png');

    // Update title
    document.title = t('seo.title');

  }, [language]); // Reacts immediately when language changes

  return null;
};

export default SEOMetadata;