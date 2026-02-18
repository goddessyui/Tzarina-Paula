
import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Sparkles, Layout, User, Book, ArrowUpRight, Zap, ShieldCheck } from 'lucide-react';
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
  const menuLinksRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // GSAP Menu Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      tlRef.current = gsap.timeline({ paused: true })
        .to(menuOverlayRef.current, {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          duration: 0.8,
          ease: gameState.mode === 'logic' ? "steps(6)" : "power4.inOut",
        })
        .from(".menu-link-item", {
          y: 100,
          opacity: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: "power3.out"
        }, "-=0.4")
        .from(".menu-footer", {
          y: 50,
          opacity: 0,
          duration: 0.4
        }, "-=0.2");
    }, menuRef);

    return () => ctx.revert();
  }, [gameState.mode]);

  // Handle Open/Close
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      tlRef.current?.play();
    } else {
      document.body.style.overflow = '';
      tlRef.current?.reverse();
    }
  }, [mobileMenuOpen]);

  const links = [
    { name: 'Works', value: 'portfolio-section', type: 'anchor', subtitle: 'Archive_01' },
    { name: 'Identity', value: 'bio-section', type: 'anchor', subtitle: 'Profile_Data' },
    { name: 'Journal', value: 'blog', type: 'page', subtitle: 'Log_Entries' },
  ];

  const handleNavClick = (link: any, e: React.MouseEvent) => {
    setMobileMenuOpen(false);
    addXP(10, e.clientX, e.clientY);
    
    if (link.type === 'anchor') {
      const scrollToTarget = (id: string) => {
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

      if (activePage === 'home') {
        scrollToTarget(link.value);
      } else {
        onNavigate('home');
        setTimeout(() => {
            window.location.hash = link.value;
        }, 100);
      }
    } else {
      onNavigate(link.value);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const isLogic = gameState.mode === 'logic';

  return (
    <nav className={`fixed top-0 left-0 w-full z-[200] transition-all duration-700 ${scrolled ? 'py-4' : 'py-6 md:py-8'}`}>
      
      {/* Background Blur Panel for Desktop */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${scrolled ? 'opacity-100' : 'opacity-0'}`}>
         <div className={`absolute inset-0 ${isLogic ? 'bg-stone-100/90 border-b border-stone-200' : 'bg-white/70 backdrop-blur-xl border-b border-white/20'}`} />
      </div>

      <div className="container-max relative flex items-center justify-between">
        
        {/* LOGO AREA */}
        <div className="flex items-center gap-6 relative z-[210]">
          <div onClick={() => onNavigate('home')} className="cursor-pointer group flex items-center gap-3">
            <div className={`logo-scan w-10 h-10 md:w-12 md:h-12 transition-all duration-500 ${isLogic ? 'grayscale brightness-125 contrast-125' : 'grayscale-0'}`}>
              <img 
                src={config.general.logoUrl} 
                alt={config.general.appName} 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="hidden sm:block">
              <h2 className="font-heading text-xl md:text-2xl text-stone-900 leading-none">Tzarina<span className="text-accent">.</span></h2>
              <p className="text-[8px] font-black uppercase tracking-[0.3em] text-stone-400 mt-1">
                {isLogic ? 'Sys_Online' : 'Status: Synced'}
              </p>
            </div>
          </div>
          
          {/* Level Badge (Desktop) */}
          <div className="hidden lg:flex items-center gap-4 bg-stone-900/5 px-4 py-2 rounded-2xl border border-stone-900/5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-[10px] font-black shadow-lg transition-colors ${isLogic ? 'bg-stone-900' : 'bg-accent'}`}>
              L{gameState.level}
            </div>
            <div className="w-24 h-1 bg-stone-200 rounded-full overflow-hidden">
              <div className="h-full bg-accent transition-all duration-700 ease-out" style={{ width: `${gameState.xp}%` }} />
            </div>
          </div>
        </div>

        {/* DESKTOP NAV LINKS */}
        <div className="hidden md:flex items-center gap-10 relative z-[210]">
          <ul className="flex items-center gap-8">
            {links.map((link) => (
              <li key={link.name}>
                <button 
                  onClick={(e) => handleNavClick(link, e)} 
                  className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-all hover:-translate-y-0.5
                    ${isLogic ? 'text-stone-500 hover:text-stone-900' : 'text-stone-400 hover:text-stone-900'}
                  `}
                >
                  {link.name}
                </button>
              </li>
            ))}
          </ul>

          <div className={`flex items-center p-1.5 rounded-full border transition-colors ${isLogic ? 'bg-stone-200 border-stone-300' : 'bg-stone-100 border-stone-200'}`}>
            <button 
              onClick={(e) => { setMode('logic'); addXP(15, e.clientX, e.clientY); }}
              className={`p-2 rounded-full transition-all ${isLogic ? 'bg-stone-900 text-white shadow-lg' : 'text-stone-400 hover:text-stone-600'}`}
              title="Activate Logic OS"
            >
              <Terminal size={14} />
            </button>
            <button 
              onClick={(e) => { setMode('creative'); addXP(15, e.clientX, e.clientY); }}
              className={`p-2 rounded-full transition-all ${!isLogic ? 'bg-accent text-stone-900 shadow-lg' : 'text-stone-400 hover:text-stone-600'}`}
              title="Activate Creative Core"
            >
              <Sparkles size={14} />
            </button>
          </div>
        </div>

        {/* MOBILE MENU BUTTON (MAGNETIC STYLE) */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
          className={`md:hidden relative z-[310] w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 shadow-xl
            ${mobileMenuOpen 
                ? (isLogic ? 'bg-white text-stone-900' : 'bg-stone-900 text-white') 
                : (isLogic ? 'bg-stone-900 text-white' : 'bg-white text-stone-900 border border-stone-100')
            }
          `}
        >
          <div className="relative w-6 h-6 flex flex-col justify-center items-center gap-1.5">
             <span className={`w-full h-0.5 transition-all duration-300 bg-current ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
             <span className={`w-full h-0.5 transition-all duration-300 bg-current ${mobileMenuOpen ? 'opacity-0' : ''}`} />
             <span className={`w-full h-0.5 transition-all duration-300 bg-current ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>
      </div>

      {/* FULL SCREEN OVERLAY MENU */}
      <div 
        ref={menuRef} 
        className="fixed inset-0 z-[300] pointer-events-none"
      >
        <div 
          ref={menuOverlayRef}
          className={`absolute inset-0 w-full h-full flex flex-col pointer-events-auto [clip-path:polygon(0%_0%,100%_0%,100%_0%,0%_0%)]
            ${isLogic 
                ? 'bg-stone-950 text-white bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-stone-900 to-black' 
                : 'bg-paper text-stone-900'
            }
          `}
        >
            {/* Menu Background Decoration */}
            <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
                 {isLogic ? (
                     <div className="w-full h-full [background-image:linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] [background-size:40px_40px]"></div>
                 ) : (
                     <div className="absolute -top-1/2 -right-1/2 w-[100vw] h-[100vw] rounded-full bg-accent blur-[100px] animate-pulse"></div>
                 )}
            </div>

            <div className="container-max h-full flex flex-col justify-center relative z-10 py-24">
                
                {/* Menu Links */}
                <div ref={menuLinksRef} className="flex flex-col gap-6 md:gap-8">
                    {links.map((link, index) => (
                        <button 
                            key={link.name} 
                            onClick={(e) => handleNavClick(link, e)}
                            className="menu-link-item group flex items-baseline gap-4 text-left w-fit"
                        >
                            <span className={`text-[10px] font-mono font-bold uppercase tracking-widest opacity-50 group-hover:text-accent transition-colors
                                ${isLogic ? 'text-stone-500' : 'text-stone-400'}
                            `}>
                                0{index + 1}
                            </span>
                            <span className={`font-heading text-6xl sm:text-7xl md:text-8xl leading-none transition-all duration-300 group-hover:translate-x-4
                                ${isLogic ? 'font-black tracking-tighter' : 'font-normal tracking-tight'}
                            `}>
                                {link.name}
                            </span>
                            <ArrowUpRight size={24} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0 text-accent" />
                        </button>
                    ))}
                </div>

                {/* Footer Actions */}
                <div className="menu-footer mt-auto pt-12 border-t border-white/10 flex flex-col gap-8">
                    
                    {/* Mode Switcher */}
                    <div className="grid grid-cols-2 gap-4">
                         <button 
                            onClick={(e) => { setMode('logic'); addXP(15, e.clientX, e.clientY); }} 
                            className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col gap-2
                                ${isLogic 
                                    ? 'bg-white text-stone-950 border-white' 
                                    : 'bg-transparent text-stone-500 border-stone-200 hover:border-stone-900 hover:text-stone-900'}
                            `}
                         >
                            <Terminal size={24} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Logic_Core</span>
                         </button>

                         <button 
                            onClick={(e) => { setMode('creative'); addXP(15, e.clientX, e.clientY); }} 
                            className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col gap-2
                                ${!isLogic 
                                    ? 'bg-accent text-stone-900 border-accent shadow-lg' 
                                    : 'bg-transparent text-stone-600 border-stone-800 hover:border-stone-500 hover:text-white'}
                            `}
                         >
                            <Sparkles size={24} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Creative_Soul</span>
                         </button>
                    </div>

                    <div className="flex justify-between items-end">
                        <div className="flex flex-col">
                            <span className="text-[9px] font-bold uppercase tracking-widest opacity-40 mb-1">Direct Protocol</span>
                            <span className="font-heading text-2xl">{config.contact.email}</span>
                        </div>
                        <div className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border
                            ${isLogic ? 'border-green-500 text-green-500' : 'border-stone-300 text-stone-400'}
                        `}>
                            System: {isLogic ? 'Secure' : 'Open'}
                        </div>
                    </div>

                </div>

            </div>
        </div>
      </div>
    </nav>
  );
};
