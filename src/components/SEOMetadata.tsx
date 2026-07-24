import { useEffect } from 'react';

const SEOMetadata = () => {
  useEffect(() => {
    // Structured Data for Organization
    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "BluNet IT Services",
      "description": "Leading IT services company specializing in software development, cybersecurity, cloud solutions, and AI-powered applications. Transform your business with cutting-edge technology solutions.",
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
        "availableLanguage": "English"
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

    // Structured Data for Local Business
    const localBusinessSchema = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "BluNet IT Services",
      "image": "https://blunetitservices.in/logo.png",
      "description": "Professional software development and IT training company in Bangalore offering web development, mobile apps, cybersecurity, and student training programs.",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "No.27, 2nd Floor, Sriranga Complex, 2nd Cross Road, Modi Hospital Road",
        "addressLocality": "Rajajinagar",
        "addressRegion": "Karnataka",
        "postalCode": "560086",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "12.9941",
        "longitude": "77.5555"
      },
      "url": "https://blunetitservices.in",
      "telephone": "+91-XXXXXXXXXX",
      "priceRange": "$$",
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday", 
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday"
        ],
        "opens": "09:00",
        "closes": "18:00"
      }
    };

    // Structured Data for Educational Organization
    const educationalSchema = {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "name": "BluNet IT Services - Training Division",
      "description": "Comprehensive IT training programs including web development, cybersecurity, data science, and emerging technologies with hands-on projects and industry mentorship.",
      "url": "https://blunetitservices.in/student-page",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "No.27, 2nd Floor, Sriranga Complex, 2nd Cross Road, Modi Hospital Road",
        "addressLocality": "Rajajinagar",
        "addressRegion": "Karnataka", 
        "postalCode": "560086",
        "addressCountry": "IN"
      },
      "hasCredential": [
        {
          "@type": "EducationalOccupationalCredential",
          "name": "Web Development Certification",
          "description": "Complete web development training with HTML, CSS, JavaScript, React, and backend technologies"
        },
        {
          "@type": "EducationalOccupationalCredential", 
          "name": "Cybersecurity Certification",
          "description": "Comprehensive cybersecurity training covering ethical hacking, network security, and digital forensics"
        },
        {
          "@type": "EducationalOccupationalCredential",
          "name": "Data Science Certification", 
          "description": "Data science and analytics training with Python, machine learning, and AI technologies"
        }
      ]
    };

    // Add structured data to head
    const addStructuredData = (schema: object, id: string) => {
      let script = document.getElementById(id);
      if (script) {
        script.textContent = JSON.stringify(schema);
      } else {
        script = document.createElement('script');
        script.id = id;
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
      }
    };

    addStructuredData(organizationSchema, 'organization-schema');
    addStructuredData(localBusinessSchema, 'local-business-schema');
    addStructuredData(educationalSchema, 'educational-schema');

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

    // Update essential meta tags
    updateMetaTag('description', 'BluNet IT Services - Leading software development company in Bangalore. Web development, mobile apps, cybersecurity, cloud solutions, AI applications, and professional IT training programs.');
    updateMetaTag('keywords', 'software development, web development, mobile app development, cybersecurity, cloud solutions, AI development, IT training, Bangalore, Karnataka, India, student training, coding bootcamp');
    updateMetaTag('og:title', 'BluNet IT Services - Software Development & IT Training Company');
    updateMetaTag('og:description', 'Transform your business with cutting-edge software solutions. Professional web development, mobile apps, cybersecurity services, and comprehensive IT training programs in Bangalore.');
    updateMetaTag('og:type', 'website');
    updateMetaTag('og:url', 'https://blunetitservices.in');
    updateMetaTag('og:image', 'https://blunetitservices.in/logo.png');
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', 'BluNet IT Services - Software Development & Training');
    updateMetaTag('twitter:description', 'Leading IT services company specializing in software development, cybersecurity, cloud solutions, and professional training programs.');
    updateMetaTag('twitter:image', 'https://blunetitservices.in/logo.png');

    // Update title
    document.title = 'BluNet IT Services - Software Development & IT Training Company in Bangalore';

  }, []);

  return null;
};

export default SEOMetadata;