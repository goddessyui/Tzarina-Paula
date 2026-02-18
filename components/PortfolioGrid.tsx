
import React, { useRef, useState, useEffect } from 'react';
import { PortfolioItem } from '../types';
import { X, Gamepad2, Zap, Crosshair, ChevronLeft } from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';

export const PortfolioGrid: React.FC<{ items: PortfolioItem[] }> = ({ items }) => {
  const { addXP, gameState } = useConfig();
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, relX: 0, relY: 0 });
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleSelect = (item: PortfolioItem, e: React.MouseEvent) => {
    addXP(20, e.clientX, e.clientY);
    setSelectedItem(item);
    document.body.style.overflow = 'hidden';
  };

  const handleClose = () => {
    setSelectedItem(null);
    document.body.style.overflow = '';
  };

  const handleMouseMove = (e: React.MouseEvent, id: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX,
      y: e.clientY,
      relX: e.clientX - rect.left,
      relY: e.clientY - rect.top
    });
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };

    if (selectedItem) {
      window.addEventListener('keydown', handleEsc);
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
      if (!selectedItem) document.body.style.overflow = '';
    };
  }, [selectedItem]);

  return (
    <>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {items.map((item, index) => (
          <div 
            key={item.id}
            onClick={(e) => handleSelect(item, e)}
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
            onMouseMove={(e) => handleMouseMove(e, item.id)}
            className={`
              break-inside-avoid mb-6 group relative cursor-pointer portfolio-card 
              animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-backwards
              ${item.mediaType === 'game_godot' ? 'is-game' : ''}
            `}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className={`
              relative w-full overflow-hidden bg-stone-100 transition-all duration-500 group-hover:-translate-y-1
              ${gameState.mode === 'logic' 
                ? 'border-2 border-stone-900 rounded-none' 
                : 'rounded-3xl shadow-sm hover:shadow-2xl border border-stone-200/50'}
            `}>
                
                <div className="relative">
                  {/* Creative Layer */}
                  <div className="relative z-10">
                    {item.mediaType === 'image' ? (
                      <img src={item.url} alt={item.title} className="w-full h-auto object-cover block" loading="lazy" />
                    ) : item.mediaType === 'game_godot' ? (
                      <div className="w-full aspect-square relative bg-stone-900">
                        <img src={item.thumbnailUrl || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80'} className="w-full h-full object-cover opacity-60" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Gamepad2 size={24} className="text-white" />
                        </div>
                      </div>
                    ) : (
                      <video src={item.url} className="w-full h-auto object-cover block" muted loop playsInline autoPlay />
                    )}
                  </div>

                  {/* Logic Layer (X-Ray Lens) */}
                  {hoveredId === item.id && (
                    <div 
                      className="absolute inset-0 z-20 pointer-events-none overflow-hidden"
                      style={{ 
                        clipPath: `circle(100px at ${mousePos.relX}px ${mousePos.relY}px)`,
                      }}
                    >
                      <div className="w-full h-full grayscale brightness-125 contrast-150 relative bg-stone-900">
                        {item.mediaType === 'image' ? (
                          <img src={item.url} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <video src={item.url} className="w-full h-full object-cover" muted loop autoPlay />
                        )}
                        <div className="absolute inset-0 [background-image:linear-gradient(to_right,#ffffff22_1px,transparent_1px),linear-gradient(to_bottom,#ffffff22_1px,transparent_1px)] [background-size:20px_20px]" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Crosshair size={40} className="text-accent/50" strokeWidth={1} />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Info Overlay */}
                  <div className="absolute inset-0 z-30 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-center backdrop-blur-[2px]">
                      <div className="text-white space-y-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                          <h3 className="font-heading text-2xl drop-shadow-lg">{item.title}</h3>
                          <div className="flex items-center justify-center gap-2">
                             <p className="text-[10px] font-bold uppercase tracking-widest">{item.category.replace(/_/g, ' ')}</p>
                          </div>
                      </div>
                  </div>
                </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL SYSTEM */}
      {selectedItem && (
        <div className="fixed inset-0 z-[2000] flex flex-col items-center animate-in fade-in duration-300">
           {/* Backdrop (Click to close) */}
           <div className="absolute inset-0 bg-stone-950/95 backdrop-blur-xl cursor-zoom-out" onClick={handleClose}></div>
           
           {/* Persistent Header with Close Action */}
           <div className="relative z-[2010] w-full flex justify-between items-center p-6 md:p-8">
              <button 
                onClick={handleClose}
                className="flex items-center gap-3 text-white/50 hover:text-white transition-colors group"
              >
                <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white/10 group-hover:scale-110 transition-all">
                    <ChevronLeft size={20} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] hidden sm:block">Back to Workshop</span>
              </button>

              <button 
                  onClick={handleClose} 
                  className="w-14 h-14 bg-white text-stone-950 rounded-full shadow-2xl flex items-center justify-center transition-all duration-500 hover:bg-accent hover:rotate-90 hover:scale-110 active:scale-95 group shadow-accent/20"
                  aria-label="Close modal"
              >
                  <X size={28} strokeWidth={3} />
              </button>
           </div>

           {/* Scrollable Modal Body */}
           <div className="relative w-full h-full overflow-y-auto no-scrollbar pb-32">
              <div className="container-responsive max-w-7xl mx-auto flex flex-col items-center">
                  <div className="w-full grid lg:grid-cols-12 gap-12 items-start pt-4">
                     
                     {/* Media Display */}
                     <div className={`lg:col-span-8 overflow-hidden bg-stone-900 shadow-2xl flex items-center justify-center ${gameState.mode === 'logic' ? 'border-4 border-white' : 'rounded-[2rem] md:rounded-[3rem]'}`}>
                        {selectedItem.mediaType === 'image' ? (
                          <img src={selectedItem.url} className="w-full h-auto object-contain max-h-[85vh]" alt={selectedItem.title} />
                        ) : selectedItem.mediaType === 'game_godot' ? (
                          <div className="aspect-video w-full"><iframe src={selectedItem.url} className="w-full h-full border-none" allow="autoplay; fullscreen; keyboard; gamepad" title={selectedItem.title} /></div>
                        ) : (
                          <video src={selectedItem.url} className="w-full h-auto max-h-[85vh] object-contain" controls autoPlay loop playsInline />
                        )}
                     </div>
                     
                     {/* Metadata */}
                     <div className="lg:col-span-4 space-y-10 text-white">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <span className="text-accent font-bold uppercase tracking-[0.3em] text-[10px]">Project Data</span>
                                <h2 className="font-heading text-4xl md:text-5xl tracking-tighter leading-tight">{selectedItem.title}</h2>
                            </div>
                            <p className="font-body text-white/60 text-lg font-light leading-relaxed">{selectedItem.description}</p>
                            
                            {/* Mobile-only Close Fallback */}
                            <button 
                                onClick={handleClose}
                                className="w-full py-4 rounded-2xl border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-widest hover:text-white hover:border-white transition-all flex items-center justify-center gap-2"
                            >
                                <X size={14} /> Close Project
                            </button>
                        </div>

                        <div className={`p-8 space-y-6 ${gameState.mode === 'logic' ? 'bg-white/5 border border-white/20' : 'bg-white/5 rounded-[2.5rem] border border-white/10 backdrop-blur-sm'}`}>
                            <div className="flex items-center gap-4">
                                <Zap size={16} className="text-accent" />
                                <div className="text-[10px] font-black uppercase tracking-widest text-white/40">Technical Specs</div>
                            </div>
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <p className="text-[9px] font-bold uppercase tracking-widest text-white/30 mb-2">Primary Tool</p>
                                    <p className="font-bold text-xs">{selectedItem.metadata?.tools?.[0] || 'Creative Cloud'}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-bold uppercase tracking-widest text-white/30 mb-2">Category</p>
                                    <p className="font-bold text-xs truncate">{selectedItem.category.replace(/_/g, ' ')}</p>
                                </div>
                            </div>
                        </div>
                     </div>
                  </div>
              </div>
           </div>
        </div>
      )}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </>
  );
};
