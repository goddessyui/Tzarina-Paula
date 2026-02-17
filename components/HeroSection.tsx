
import React, { useState, useEffect, useRef } from 'react';
import { useConfig } from '../contexts/ConfigContext';
import { ArrowRight, Cpu, Wand2 } from 'lucide-react';
import gsap from 'gsap';

interface HeroSectionProps {
  onNavigate?: (page: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  const { config, gameState, addXP } = useConfig();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<HTMLSpanElement[]>([]);

  // Helper to optimize Cloudinary URLs for performance and transparency
  const optimizeUrl = (url: string | undefined) => {
    if (!url) return '';
    if (url.includes('cloudinary.com')) {
      // If it's a video, add optimization parameters including auto format (f_auto) 
      // which handles transparency (alpha) automatically for WebM/MP4
      if (url.match(/\.(mp4|mov|webm|ogv)$|video\/upload/)) {
        return url.replace('/upload/', '/upload/f_auto,q_auto,vc_auto/');
      }
      // If it's an image
      return url.replace('/upload/', '/upload/f_auto,q_auto/');
    }
    return url;
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(wordsRef.current, 
        { y: 80, opacity: 0, skewY: 10 },
        { 
          y: 0, opacity: 1, skewY: 0,
          duration: 1.5, stagger: 0.15, ease: "expo.out", delay: 0.4 
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ 
        x: (e.clientX / window.innerWidth) - 0.5, 
        y: (e.clientY / window.innerHeight) - 0.5 
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section ref={containerRef} className="relative w-full h-screen min-h-[700px] flex items-center overflow-hidden transition-colors duration-1000">
        
        {/* PARALLAX MULTI-LAYER STACK */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
            
            {/* 1. BACKGROUND LAYER (Distant Environment) */}
            <div 
              className={`absolute inset-0 transition-all duration-1000 ease-out opacity-30 
                ${gameState.mode === 'logic' ? 'grayscale brightness-110' : 'sepia-[0.1] contrast-105'}`}
              style={{ transform: `translate3d(${mousePos.x * -15}px, ${mousePos.y * -15}px, 0) scale(1.05)` }}
            >
                {config.hero.backgroundType === 'video' ? (
                  <video 
                    src={optimizeUrl(config.hero.backgroundImage)} 
                    autoPlay 
                    muted 
                    loop 
                    playsInline 
                    preload="auto"
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <img 
                    src={optimizeUrl(config.hero.backgroundImage)} 
                    alt="" 
                    className="w-full h-full object-cover" 
                  />
                )}
            </div>

            {/* 2. MIDGROUND LAYER (Animated Earth) */}
            {config.hero.midgroundVideo && (
              <div 
                className={`absolute inset-0 z-10 flex items-center justify-center transition-all duration-1000
                  ${gameState.mode === 'logic' ? 'grayscale opacity-10 mix-blend-screen' : 'opacity-80 mix-blend-screen'}`}
                style={{ transform: `translate3d(${mousePos.x * -35}px, ${mousePos.y * -35}px, 0) scale(1.1)` }}
              >
                <video 
                  src={optimizeUrl(config.hero.midgroundVideo)} 
                  autoPlay 
                  muted 
                  loop 
                  playsInline 
                  preload="auto"
                  className="w-full h-full object-contain md:scale-90"
                />
              </div>
            )}

            {/* 3. FOREGROUND LAYER (Animated Character) */}
            {config.hero.foregroundVideo && (
              <div 
                className={`absolute inset-0 z-20 flex items-center justify-center transition-all duration-1000
                  ${gameState.mode === 'logic' ? 'grayscale brightness-150 contrast-125 opacity-20' : 'opacity-100'}`}
                style={{ 
                    transform: `translate3d(${mousePos.x * -70}px, ${mousePos.y * -70}px, 0) scale(1.2)`,
                    filter: gameState.mode === 'creative' ? 'drop-shadow(0 30px 60px rgba(0,0,0,0.3))' : 'none'
                }}
              >
                <video 
                  src={optimizeUrl(config.hero.foregroundVideo)} 
                  autoPlay 
                  muted 
                  loop 
                  playsInline 
                  preload="auto"
                  className="h-[120%] w-auto object-contain animate-float-hero"
                />
              </div>
            )}
            
            {/* OVERLAY GRID (Logic Mode) */}
            {gameState.mode === 'logic' ? (
                <div className="absolute inset-0 z-30 [background-image:linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] [background-size:60px_60px]" />
            ) : (
                <div className="absolute inset-0 z-30 bg-gradient-to-t from-stone-900/10 via-transparent to-transparent" />
            )}
        </div>

        {/* HERO CONTENT */}
        <div className="container-max relative z-40 w-full pointer-events-none">
            <div className="max-w-4xl space-y-10 pointer-events-auto">
                <div className="flex items-center gap-4 opacity-60">
                    {gameState.mode === 'logic' ? <Cpu size={14} /> : <Wand2 size={14} className="text-accent" />}
                    <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-stone-500">{gameState.mode === 'logic' ? 'STRUCTURAL_OS_v3' : 'CREATIVE_CORE_v3'}</span>
                </div>

                <h1 className="font-heading text-hero text-stone-950 flex flex-col tracking-tighter">
                    <span ref={el => el && (wordsRef.current[0] = el)} className="block">{config.hero.headlineWord1}</span>
                    <span ref={el => el && (wordsRef.current[1] = el)} className={`block italic ${gameState.mode === 'logic' ? 'not-italic underline decoration-accent decoration-4 underline-offset-8' : 'text-stone-400 drop-shadow-[0_0_15px_rgba(250,140,150,0.2)]'}`}>{config.hero.headlineWord2}</span>
                    <span ref={el => el && (wordsRef.current[2] = el)} className={`block ${gameState.mode === 'creative' ? 'text-accent' : ''}`}>{config.hero.headlineWord3}</span>
                </h1>

                <div className="flex flex-col sm:flex-row items-center gap-8 pt-10">
                    <button 
                        onClick={(e) => { addXP(100, e.clientX, e.clientY); onNavigate?.('contact'); }}
                        className={`group px-12 py-6 flex items-center gap-6 transition-all duration-500 shadow-2xl active:scale-95 no-logic
                          ${gameState.mode === 'logic' ? 'bg-stone-900 text-white rounded-none' : 'bg-stone-950 text-white rounded-full hover:bg-accent hover:text-stone-900 shadow-accent/20'}`}
                    >
                        <span className="font-bold text-sm uppercase tracking-[0.3em]">{config.general.tagline}</span>
                        <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                    </button>
                    
                    <div className="flex flex-col text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">
                        <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Connection Secure</span>
                        <span className="opacity-60 mt-1">Lvl {gameState.level} Hybrid Entity</span>
                    </div>
                </div>
            </div>
        </div>

        <style>{`
          @keyframes float-hero {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }
          .animate-float-hero {
            animation: float-hero 8s ease-in-out infinite;
          }
        `}</style>
    </section>
  );
};
