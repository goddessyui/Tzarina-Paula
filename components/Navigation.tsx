
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Terminal, Sparkles, X, Menu, ArrowUpRight } from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';
import gsap from 'gsap';

interface NavigationProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activePage, onNavigate }) => {
  const { config, gameState, setMode, addXP } = useConfig();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const menuRef = useRef<HTMLDivElement>(null);
  const menuOverlayRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  // --- MODULAR LINK REGISTRY ---
  const navLinks = useMemo(() => [
    { name: 'Works', value: 'portfolio-section', type: 'anchor' },
    { name: 'Identity', value: 'bio-section', type: 'anchor' },
    { name: 'Journal', value: 'blog', type: 'page' },
    { name: 'Connect', value: 'contact-section', type: 'anchor' },
  ], []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      tlRef.current = gsap.timeline({ paused: true })
        .to(menuOverlayRef.current, {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          duration: 0.8,
          ease: "expo.inOut",
        })
        .from(".menu-link-item", {
          y: 40,
          opacity: 0,
          stagger: 0.08,
          duration: 0.4,
          ease: "power2.out"
        }, "-=0.4");
    }, menuRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      tlRef.current?.play();
    } else {
      document.body.style.overflow = '';
      tlRef.current?.reverse();
    }
  }, [mobileMenuOpen]);

  const scrollToElement = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  const handleNavAction = (link: any, e: React.MouseEvent) => {
    setMobileMenuOpen(false);
    addXP(15, e.clientX, e.clientY);

    if (link.type === 'anchor') {
      if (activePage === 'home') {
        // If already home, scroll immediately
        if (window.location.hash === `#${link.value}`) {
          scrollToElement(link.value);
        } else {
          window.location.hash = link.value;
        }
      } else {
        // Cross-page anchor navigation: Store hash and go home
        window.location.hash = link.value;
        onNavigate('home');
      }
    } else {
      onNavigate(link.value);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const isLogic = gameState.mode === 'logic';

  return (
    <nav className={`fixed top-0 left-0 w-full z-[1000] transition-all duration-700 ${scrolled ? 'py-4' : 'py-6 md:py-8'}`}>
      
      {/* Background Blur */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${scrolled ? 'opacity-100' : 'opacity-0'}`}>
         <div className={`absolute inset-0 ${isLogic ? 'bg-stone-50/90 border-b border-stone-200' : 'bg-white/70 backdrop-blur-2xl border-b border-white/5 shadow-sm'}`} />
      </div>

      <div className="container-responsive max-w-7xl relative flex items-center justify-between">
        
        {/* Logo */}
        <div 
          onClick={() => { onNavigate('home'); window.scrollTo({top:0, behavior:'smooth'}); window.location.hash = ''; }} 
          className="flex items-center gap-4 cursor-pointer group"
        >
          <div className={`logo-scan w-10 h-10 md:w-12 md:h-12 transition-all duration-500 ${isLogic ? 'grayscale contrast-125' : 'grayscale-0'}`}>
            <img src={config.general.logoUrl} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div className="hidden sm:block">
            <h2 className="font-heading text-xl md:text-2xl text-stone-900 leading-none">Tzarina<span className="text-accent">.</span></h2>
            <p className="text-[8px] font-black uppercase tracking-[0.4em] text-stone-400 mt-1.5">Studio_Build_v3.2</p>
          </div>
        </div>

        {/* Desktop Controls */}
        <div className="hidden md:flex items-center gap-12">
          <ul className="flex items-center gap-10">
            {navLinks.map((link) => (
              <li key={link.name}>
                <button 
                  onClick={(e) => handleNavAction(link, e)} 
                  className={`text-[10px] font-black uppercase tracking-[0.25em] transition-all hover:text-accent hover:-translate-y-0.5
                    ${isLogic ? 'text-stone-500' : 'text-stone-400'}
                  `}
                >
                  {link.name}
                </button>
              </li>
            ))}
          </ul>

          <div className={`flex items-center p-1.5 rounded-full border transition-all ${isLogic ? 'bg-stone-200 border-stone-300' : 'bg-stone-100 border-stone-200/50'}`}>
            <button 
              onClick={(e) => { setMode('logic'); addXP(15, e.clientX, e.clientY); }}
              className={`p-2.5 rounded-full transition-all ${isLogic ? 'bg-stone-950 text-white shadow-xl scale-110' : 'text-stone-400 hover:text-stone-600'}`}
              title="Logic Mode"
            >
              <Terminal size={14} />
            </button>
            <button 
              onClick={(e) => { setMode('creative'); addXP(15, e.clientX, e.clientY); }}
              className={`p-2.5 rounded-full transition-all ${!isLogic ? 'bg-accent text-stone-950 shadow-xl scale-110' : 'text-stone-400 hover:text-stone-600'}`}
              title="Creative Mode"
            >
              <Sparkles size={14} />
            </button>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
          className={`md:hidden relative z-[1100] w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl
            ${mobileMenuOpen ? 'bg-stone-900 text-white' : 'bg-white text-stone-900 border border-stone-100'}
          `}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Full Screen Menu Overlay */}
      <div ref={menuRef} className="fixed inset-0 z-[1050] pointer-events-none">
        <div 
          ref={menuOverlayRef}
          className={`absolute inset-0 w-full h-full flex flex-col pointer-events-auto [clip-path:polygon(0%_0%,100%_0%,100%_0%,0%_0%)]
            ${isLogic ? 'bg-stone-950 text-white' : 'bg-paper text-stone-900'}
          `}
        >
            <div className="container-responsive max-w-7xl h-full flex flex-col justify-center relative py-20">
                <div className="flex flex-col gap-8">
                    {navLinks.map((link, index) => (
                        <button 
                            key={link.name} 
                            onClick={(e) => handleNavAction(link, e)}
                            className="menu-link-item group flex items-baseline gap-6 text-left w-fit"
                        >
                            <span className="text-xs font-mono font-bold opacity-20 group-hover:opacity-100 group-hover:text-accent transition-all">0{index + 1}</span>
                            <span className="font-heading text-5xl sm:text-7xl md:text-8xl transition-all duration-500 group-hover:translate-x-6 group-hover:text-accent tracking-tighter">
                                {link.name}
                            </span>
                            <ArrowUpRight size={32} className="opacity-0 group-hover:opacity-100 transition-all text-accent -translate-y-4 group-hover:translate-y-0" />
                        </button>
                    ))}
                </div>

                <div className="mt-auto pt-16 border-t border-stone-200/10 flex flex-col md:flex-row justify-between gap-12">
                    <div className="space-y-2">
                        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-stone-400">Direct Comms</span>
                        <p className="font-heading text-3xl">{config.contact.email}</p>
                    </div>
                    <div className="flex gap-6 items-end">
                         {Object.entries(config.contact.socials).map(([key, url]) => (
                             url && <a key={key} href={url} target="_blank" rel="noreferrer" className="text-stone-400 hover:text-accent transition-colors text-[10px] font-black uppercase tracking-widest">{key}</a>
                         ))}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </nav>
  );
};
