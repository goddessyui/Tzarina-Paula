
import React, { useState, useEffect } from 'react';
import { Terminal, Sparkles, Menu, X, Layout, User, Book } from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';

interface NavigationProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activePage, onNavigate }) => {
  const { config, gameState, setMode, addXP } = useConfig();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { name: 'Works', value: 'portfolio-section', type: 'anchor', icon: Layout },
    { name: 'Identity', value: 'bio-section', type: 'anchor', icon: User },
    // Showcase link removed
    { name: 'Journal', value: 'blog', type: 'page', icon: Book },
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
        // Navigate home first
        onNavigate('home');
        // Set hash after a brief delay to ensure URL isn't overwritten immediately by App router
        setTimeout(() => {
            window.location.hash = link.value;
        }, 100);
      }
    } else {
      onNavigate(link.value);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-[200] transition-all duration-700 ${scrolled ? 'py-4 bg-white/70 backdrop-blur-2xl border-b border-stone-200/30' : 'py-8 bg-transparent'}`}>
      <div className="container-max flex items-center justify-between">
        
        {/* LOGO & HUD STATUS */}
        <div className="flex items-center gap-6">
          <div onClick={() => onNavigate('home')} className="cursor-pointer group flex items-center gap-3">
            <div className={`logo-scan w-10 h-10 md:w-12 md:h-12 transition-all duration-500 ${gameState.mode === 'logic' ? 'grayscale brightness-125 contrast-125' : 'grayscale-0'}`}>
              <img 
                src={config.general.logoUrl} 
                alt={config.general.appName} 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="hidden sm:block">
              <h2 className="font-heading text-xl md:text-2xl text-stone-900 leading-none">Tzarina<span className="text-accent">.</span></h2>
              <p className="text-[8px] font-black uppercase tracking-[0.3em] text-stone-400 mt-1">Status: Synced</p>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-4 bg-stone-900/5 px-4 py-2 rounded-2xl border border-stone-900/5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-[10px] font-black shadow-lg transition-colors ${gameState.mode === 'logic' ? 'bg-stone-900' : 'bg-accent'}`}>
              L{gameState.level}
            </div>
            <div className="w-24 h-1 bg-stone-200 rounded-full overflow-hidden">
              <div className="h-full bg-accent transition-all duration-700 ease-out" style={{ width: `${gameState.xp}%` }} />
            </div>
          </div>
        </div>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-10">
          <ul className="flex items-center gap-8">
            {links.map((link) => (
              <li key={link.name}>
                <button 
                  onClick={(e) => handleNavClick(link, e)} 
                  className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 hover:text-stone-900 transition-colors"
                >
                  {link.name}
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center bg-stone-100 p-1.5 rounded-full border border-stone-200">
            <button 
              onClick={(e) => { setMode('logic'); addXP(15, e.clientX, e.clientY); }}
              className={`p-2 rounded-full transition-all ${gameState.mode === 'logic' ? 'bg-stone-900 text-white shadow-lg' : 'text-stone-300'}`}
              title="Activate Logic OS"
            >
              <Terminal size={14} />
            </button>
            <button 
              onClick={(e) => { setMode('creative'); addXP(15, e.clientX, e.clientY); }}
              className={`p-2 rounded-full transition-all ${gameState.mode === 'creative' ? 'bg-accent text-stone-900 shadow-lg' : 'text-stone-300'}`}
              title="Activate Creative Core"
            >
              <Sparkles size={14} />
            </button>
          </div>
        </div>

        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-3 bg-stone-900 text-white rounded-2xl">
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-0 left-0 w-full h-screen bg-white z-[300] flex flex-col p-12 animate-in slide-in-from-top duration-500">
           <div className="flex justify-between items-center mb-16">
              <div className="flex items-center gap-4">
                <img src={config.general.logoUrl} alt="Logo" className="w-12 h-12 grayscale" />
                <h2 className="font-heading text-4xl">Tzarina<span className="text-accent">.</span></h2>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-4 bg-stone-900 text-white rounded-2xl"><X size={24}/></button>
           </div>
           <div className="space-y-8">
              {links.map(link => (
                <button 
                  key={link.name} 
                  onClick={(e) => handleNavClick(link, e)}
                  className="block w-full text-left font-heading text-6xl text-stone-900 hover:text-accent transition-colors"
                >
                  {link.name}
                </button>
              ))}
           </div>
           <div className="mt-auto pt-12 border-t border-stone-100 flex flex-col gap-6">
              <div className="flex gap-4">
                 <button onClick={(e) => { setMode('logic'); addXP(15, e.clientX, e.clientY); }} className={`flex-1 px-6 py-4 rounded-xl border text-[10px] font-black uppercase tracking-widest ${gameState.mode === 'logic' ? 'bg-stone-900 text-white border-stone-900' : 'text-stone-400 border-stone-200'}`}>Logic_Mode</button>
                 <button onClick={(e) => { setMode('creative'); addXP(15, e.clientX, e.clientY); }} className={`flex-1 px-6 py-4 rounded-xl border text-[10px] font-black uppercase tracking-widest ${gameState.mode === 'creative' ? 'bg-accent text-stone-900 border-accent' : 'text-stone-400 border-stone-200'}`}>Creative_Mode</button>
              </div>
           </div>
        </div>
      )}
    </nav>
  );
};
