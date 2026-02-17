
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
    const { seo, general, contact } = config;
    if (!seo) return;

    // Determine effective values (Override > Config)
    const title = override?.title ? `${override.title} | ${general.appName}` : (seo.metaTitle || general.appName);
    const description = override?.description || seo.metaDescription;
    const image = override?.image || seo.ogImage;
    const type = override?.type || 'website';
    const keywords = override?.tags ? override.tags.join(', ') : seo.keywords;

    // 1. Basic Meta Tags
    document.title = title;

    const setMeta = (name: string, content: string) => {
      if (!content) return;
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('description', description);
    setMeta('keywords', keywords);
    setMeta('author', override?.author || general.appName);
    setMeta('robots', 'index, follow');

    // 2. OpenGraph / Social
    const ogProps = [
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image },
      { property: 'og:type', content: type },
      { property: 'og:url', content: window.location.href },
      { property: 'og:site_name', content: general.appName },
      // Twitter Card
      { property: 'twitter:card', content: 'summary_large_image' },
      { property: 'twitter:title', content: title },
      { property: 'twitter:description', content: description },
      { property: 'twitter:image', content: image },
    ];

    ogProps.forEach(({ property, content }) => {
      if (!content) return;
      let el = document.querySelector(`meta[property="${property}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('property', property);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    });

    // 3. JSON-LD Structured Data (Generative Engine Optimization)
    // We create a "Person" schema linked to "ProfessionalService" and inject the aiKnowledgeContext
    const socialLinks = Object.values(contact.socials).filter((url) => typeof url === 'string' && url.length > 0);
    
    let structuredData: any = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": general.appName,
      "url": window.location.origin,
      "image": seo.ogImage,
      "jobTitle": "Digital Multimedia Artist",
      "description": seo.metaDescription,
      // GEO: Injecting specific knowledge context for AI
      "disambiguatingDescription": seo.aiKnowledgeContext || seo.metaDescription,
      "email": contact.email,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": contact.location,
        "addressCountry": "PH"
      },
      "sameAs": socialLinks,
      "knowsAbout": [
        "Motion Graphics", 
        "Animation", 
        "Illustration", 
        "React Development", 
        "Graphic Design",
        ...(seo.keywords ? seo.keywords.split(',').map(k => k.trim()) : [])
      ]
    };

    // If this is a Blog Post, we switch to BlogPosting Schema
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
            "articleBody": description // In a full implementation, we might truncate actual content here
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
