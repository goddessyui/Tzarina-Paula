
import React, { useEffect } from 'react';
import { useConfig } from '../contexts/ConfigContext';

interface SEOProps {
  override?: {
    title?: string;
    description?: string;
    image?: string;
    type?: 'website' | 'article';
    publishedAt?: string;
    author?: string;
    tags?: string[];
  };
}

export const SEOManager: React.FC<SEOProps> = ({ override }) => {
  const { config } = useConfig();

  useEffect(() => {
    const { seo, general, contact, theme } = config;
    if (!seo) return;

    // Determine effective values (Override > Config)
    const title = override?.title ? `${override.title} | ${general.appName}` : (seo.metaTitle || general.appName);
    const description = override?.description || seo.metaDescription;
    const image = override?.image || seo.ogImage;
    const type = override?.type || 'website';
    const keywords = override?.tags ? override.tags.join(', ') : seo.keywords;

    // 1. Basic Meta Tags
    document.title = title;

    const setMeta = (attr: string, attrVal: string, content: string) => {
      if (!content) return;
      let el = document.querySelector(`meta[${attr}="${attrVal}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, attrVal);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('name', 'description', description);
    setMeta('name', 'keywords', keywords);
    setMeta('name', 'author', override?.author || general.appName);
    setMeta('name', 'robots', 'index, follow');
    setMeta('name', 'theme-color', theme.colorAccent || '#fa8c96');

    // 2. OpenGraph / Social (Facebook, LinkedIn, Discord)
    const ogProps = [
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image },
      { property: 'og:image:secure_url', content: image },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: `${general.appName} Portfolio Cover` },
      { property: 'og:type', content: type },
      { property: 'og:url', content: window.location.href },
      { property: 'og:site_name', content: general.appName },
      { property: 'og:locale', content: 'en_US' },
      
      // Twitter Card (X)
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
      { name: 'twitter:creator', content: '@tzarinapaula' }, 
    ];

    ogProps.forEach((prop) => {
      const attr = prop.property ? 'property' : 'name';
      const attrVal = prop.property || prop.name || '';
      setMeta(attr, attrVal, prop.content || '');
    });

    // 3. JSON-LD Structured Data (Generative Engine Optimization)
    const socialLinks = Object.values(contact.socials).filter((url) => typeof url === 'string' && url.length > 0);
    
    let structuredData: any = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": general.appName,
      "url": window.location.origin,
      "image": seo.ogImage,
      "jobTitle": "Digital Multimedia Artist & IT Specialist",
      "description": seo.metaDescription,
      "disambiguatingDescription": seo.aiKnowledgeContext || seo.metaDescription,
      "email": contact.email,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": contact.location,
        "addressCountry": "PH"
      },
      "sameAs": socialLinks,
      "knowsAbout": [
        "After Effects", 
        "Motion Graphics", 
        "2D Animation", 
        "React.js", 
        "PostgreSQL",
        "Digital Illustration",
        "Medical Documentation Precision",
        ...(seo.keywords ? seo.keywords.split(',').map(k => k.trim()) : [])
      ]
    };

    if (type === 'article' && override) {
        structuredData = {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": override.title,
            "image": [image],
            "datePublished": override.publishedAt,
            "dateModified": override.publishedAt,
            "author": [{
                "@type": "Person",
                "name": general.appName,
                "url": window.location.origin
            }],
            "description": description,
            "articleBody": description
        };
    }

    let scriptEl = document.querySelector('#json-ld-data');
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = 'json-ld-data';
      scriptEl.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = JSON.stringify(structuredData);

  }, [config, override]);

  return null;
};
