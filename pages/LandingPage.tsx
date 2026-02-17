
import React, { useEffect, useState } from 'react';
import { HeroSection } from '../components/HeroSection';
import { BioSection } from '../components/BioSection';
import { PortfolioSection } from '../components/PortfolioSection';
import { TestimonialSection } from '../components/TestimonialSection';
import { JournalSection } from '../components/JournalSection';
import { BongoCatLoader } from '../components/BongoCatLoader';
import { portfolioService } from '../services/supabaseService';
import { PortfolioItem } from '../types';
import { ContactSection } from '../components/ContactSection';
import { useConfig } from '../contexts/ConfigContext';

export const LandingPage: React.FC<{ onNavigate?: (page: string) => void }> = ({ onNavigate }) => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { gameState } = useConfig();

  useEffect(() => {
    portfolioService.getAll().then(setItems).finally(() => {
        setTimeout(() => {
            setLoading(false);
            // Check for hash and scroll to it after loading
            if (window.location.hash) {
                const id = window.location.hash.replace('#', '');
                setTimeout(() => {
                    const el = document.getElementById(id);
                    if (el) {
                        const offset = 100;
                        const bodyRect = document.body.getBoundingClientRect().top;
                        const elementRect = el.getBoundingClientRect().top;
                        const elementPosition = elementRect - bodyRect;
                        const offsetPosition = elementPosition - offset;
                        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                    }
                }, 500); // Allow DOM to settle
            }
        }, 2000);
    });
  }, []);

  if (loading) return <BongoCatLoader />;

  return (
    // Flexbox Architecture: Forces natural document flow vertical stacking
    // This prevents margin collapsing issues that can confuse GSAP
    <div className={`flex flex-col w-full relative min-h-screen ${gameState.mode === 'logic' ? 'gap-0' : 'gap-0'}`}>
      
      {/* 01. HERO - Order 1 */}
      <div className="flex-none z-10">
        <HeroSection onNavigate={onNavigate} />
      </div>

      {/* 02. PORTFOLIO - Order 2 (Dynamic Height) */}
      {/* z-20 ensures that if the Bio section pins underneath, this stays cleanly above or pushes it down */}
      <div className="flex-auto relative z-20 bg-paper">
        <PortfolioSection items={items} />
      </div>

      {/* 03. BIO - Order 3 (Pinned) */}
      {/* z-30 allows the pinning effect to layer correctly over the subsequent content but respect the portfolio flow */}
      <div className="flex-none relative z-30">
        <BioSection />
      </div>

      {/* 04. STORIES - Removed for now */}
      
      {/* 05. SOCIAL / TRUST - Order 5 */}
      <div className="flex-none relative z-50 bg-paper border-t border-stone-200/50">
        <TestimonialSection />
        <JournalSection onNavigate={onNavigate!} />
      </div>

      {/* 06. CONTACT - Order 6 */}
      <div className="flex-none relative z-50 border-t border-stone-200/50 bg-paper">
        <ContactSection />
      </div>

    </div>
  );
};
