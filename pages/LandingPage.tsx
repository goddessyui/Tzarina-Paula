
import React, { useEffect, useState, useMemo } from 'react';
import { HeroSection } from '../components/HeroSection';
import { BioSection } from '../components/BioSection';
import { PortfolioSection } from '../components/PortfolioSection';
import { TestimonialSection } from '../components/TestimonialSection';
import { JournalSection } from '../components/JournalSection';
import { ContactSection } from '../components/ContactSection';
import { BongoCatLoader } from '../components/BongoCatLoader';
import { portfolioService } from '../services/supabaseService';
import { PortfolioItem } from '../types';
import { useConfig } from '../contexts/ConfigContext';

export interface SiteModule {
  id: string;
  label: string;
  Component: React.FC<any>;
  showInMenu: boolean;
  props?: any;
}

export const LandingPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { gameState } = useConfig();

  useEffect(() => {
    portfolioService.getAll()
      .then(setItems)
      .finally(() => {
        setTimeout(() => setLoading(false), 1200);
      });
  }, []);

  // --- MODULAR SECTION REGISTRY ---
  const SECTION_CONFIG: SiteModule[] = useMemo(() => [
    { 
      id: 'hero-section', 
      label: 'Home', 
      Component: HeroSection, 
      showInMenu: false,
      props: { onNavigate }
    },
    { 
      id: 'portfolio-section', 
      label: 'Works', 
      Component: PortfolioSection, 
      showInMenu: true,
      props: { items }
    },
    { 
      id: 'bio-section', 
      label: 'Identity', 
      Component: BioSection, 
      showInMenu: true 
    },
    { 
      id: 'testimonial-section', 
      label: 'Testimonials', 
      Component: TestimonialSection, 
      showInMenu: false 
    },
    { 
      id: 'journal-section', 
      label: 'Journal', 
      Component: JournalSection, 
      showInMenu: true,
      props: { onNavigate }
    },
    { 
      id: 'contact-section', 
      label: 'Connect', 
      Component: ContactSection, 
      showInMenu: true 
    }
  ], [items, onNavigate]);

  // Handle hash scrolling
  useEffect(() => {
    const handleHashScroll = () => {
      if (loading) return;

      const hash = window.location.hash.replace('#', '');
      if (hash) {
        // Delay slightly for render stabilization
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            const offset = 100;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;
            
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }, 100);
      }
    };

    handleHashScroll();
    window.addEventListener('hashchange', handleHashScroll);
    return () => window.removeEventListener('hashchange', handleHashScroll);
  }, [loading]);

  if (loading) return <BongoCatLoader />;

  return (
    <div className={`modular-container w-full min-h-screen ${gameState.mode === 'logic' ? 'logic-layout' : 'creative-layout'}`}>
      {SECTION_CONFIG.map(({ id, Component, props }) => (
        <section 
          key={id} 
          id={id} 
          className="w-full relative overflow-hidden"
        >
          <Component {...(props || {})} />
        </section>
      ))}
    </div>
  );
};
