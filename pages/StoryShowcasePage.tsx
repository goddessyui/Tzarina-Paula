
import React, { useState, useEffect } from 'react';
import { useConfig } from '../contexts/ConfigContext';
import { Play, Maximize2, X, BookOpen, Film, Sparkles, ArrowRight } from 'lucide-react';

interface StoryShowcasePageProps {
  onNavigate: (page: string) => void;
}

export const StoryShowcasePage: React.FC<StoryShowcasePageProps> = ({ onNavigate }) => {
  const { config } = useConfig();
  const { story } = config;
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const handleClose = () => {
    setActiveVideo(null);
    document.body.style.overflow = '';
  };

  const handleOpen = (url: string) => {
    setActiveVideo(url);
    document.body.style.overflow = 'hidden';
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    if (activeVideo) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [activeVideo]);

  return (
    <div className="min-h-screen bg-paper pt-32 pb-24 relative overflow-x-hidden">
      {/* 1. CINEMATIC HEADER */}
      <header className="container-responsive max-w-7xl mb-32">
        <div className="flex flex-col md:flex-row gap-12 items-end">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-stone-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em]">
              <BookOpen size={14} /> Featured Narrative
            </div>
            <h1 className="font-heading text-6xl md:text-[8rem] text-stone-900 leading-[0.8] tracking-tighter">
              {story.title}
            </h1>
          </div>
          <div className="md:w-1/3 pb-4">
             <p className="font-body text-stone-500 text-lg md:text-xl font-light italic leading-relaxed border-l-2 border-accent pl-8">
               {story.synopsis}
             </p>
          </div>
        </div>
      </header>

      {/* 2. THE VIRTUAL BOOK */}
      <section className="container-responsive max-w-7xl mb-48">
        <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-center">
            <div className="space-y-6 group">
                <p className="font-mono text-[9px] uppercase tracking-[0.4em] text-stone-300">Front_Plate // v1.0</p>
                <div className="aspect-[3/4] rounded-r-3xl rounded-l-md overflow-hidden bg-white shadow-2xl transition-transform duration-1000 group-hover:-rotate-1 group-hover:scale-[1.02] border-l-8 border-stone-800 relative">
                    <img src={story.frontCoverUrl} className="w-full h-full object-cover" alt="Front Cover" />
                    <div className="absolute inset-0 bg-stone-900/5 pointer-events-none"></div>
                </div>
            </div>
            
            <div className="space-y-6 group">
                <p className="font-mono text-[9px] uppercase tracking-[0.4em] text-stone-300">Reverse_Plate // v1.0</p>
                <div className="aspect-[3/4] rounded-l-3xl rounded-r-md overflow-hidden bg-white shadow-2xl transition-transform duration-1000 group-hover:rotate-1 group-hover:scale-[1.02] border-r-8 border-stone-800 relative">
                    <img src={story.backCoverUrl} className="w-full h-full object-cover" alt="Back Cover" />
                    <div className="absolute inset-0 bg-stone-900/5 pointer-events-none"></div>
                </div>
            </div>
        </div>
      </section>

      {/* 3. THE ANIMATION REEL */}
      <section className="bg-stone-900 py-32 md:py-48 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px]"></div>
        
        <div className="container-responsive max-w-7xl relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
            <div className="space-y-6">
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-accent text-stone-900 rounded-full text-[10px] font-black uppercase tracking-[0.3em]">
                  <Film size={14} /> Motion Showcase
                </div>
                <h2 className="font-heading text-5xl md:text-7xl tracking-tighter">Bringing the<br/>pages to life.</h2>
            </div>
            <p className="max-w-md text-stone-400 font-light text-lg leading-relaxed">
              Every story deserves a heartbeat. I transform static visual development into kinetic marketing assets.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 md:gap-24">
            {story.animations.map((anim, idx) => (
              <div key={idx} className="group cursor-pointer space-y-8" onClick={() => handleOpen(anim.videoUrl)}>
                <div className="relative aspect-video rounded-3xl overflow-hidden bg-stone-800 border border-white/10 shadow-2xl transition-all duration-700 group-hover:scale-[1.03] group-hover:border-accent">
                   <img src={anim.thumbnailUrl} className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" alt={anim.title} />
                   <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center text-white transition-all duration-500 group-hover:bg-accent group-hover:text-stone-900 group-hover:scale-110">
                        <Play fill="currentColor" size={32} />
                      </div>
                   </div>
                </div>
                <div>
                   <h3 className="font-heading text-3xl mb-2">{anim.title}</h3>
                   <div className="flex items-center gap-4">
                      <div className="h-px flex-1 bg-white/20"></div>
                      <span className="font-mono text-[9px] uppercase tracking-widest text-stone-500">Video_Stream.mp4</span>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION */}
      <section className="py-32 md:py-48 text-center">
          <div className="container-responsive max-w-4xl mx-auto space-y-12">
            <div className="flex justify-center"><Sparkles size={48} className="text-accent animate-pulse" /></div>
            <h2 className="font-heading text-5xl md:text-8xl text-stone-900 tracking-tighter leading-[0.9]">
              Are you an author with a vision?
            </h2>
            <p className="text-stone-500 text-xl md:text-2xl font-light italic max-w-2xl mx-auto leading-relaxed">
              Let's collaborate to build an immersive universe for your characters.
            </p>
            <div className="pt-8">
              <button onClick={() => onNavigate('contact')} className="group inline-flex items-center gap-6 px-12 py-6 bg-stone-900 text-white rounded-full font-black uppercase tracking-[0.4em] text-xs hover:bg-accent hover:text-stone-900 transition-all shadow-2xl hover:-translate-y-2">
                Start a Collaboration <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </div>
      </section>

      {/* VIDEO MODAL */}
      {activeVideo && (
        <div className="fixed inset-0 z-[1000] bg-stone-950/98 backdrop-blur-2xl flex items-center justify-center p-6 md:p-12 animate-in fade-in duration-500">
           {/* Backdrop closure */}
           <div className="absolute inset-0 z-0" onClick={handleClose}></div>
           
           <button 
              onClick={handleClose} 
              className="fixed top-8 right-8 z-[1010] w-14 h-14 bg-white text-stone-950 rounded-full shadow-2xl flex items-center justify-center transition-all duration-500 hover:bg-accent hover:rotate-90 hover:scale-110 active:scale-95 group animate-in slide-in-from-top-4"
              aria-label="Close video"
           >
             <X size={28} strokeWidth={3} />
           </button>
           
           <div className="w-full max-w-6xl aspect-video bg-black rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/5 relative z-10">
              <video src={activeVideo} className="w-full h-full" controls autoPlay />
           </div>
        </div>
      )}
    </div>
  );
};
