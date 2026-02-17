
import React, { useRef, useState, useEffect } from 'react';
import { PortfolioItem } from '../types';
import { X, Gamepad2, Zap } from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';

export const PortfolioGrid: React.FC<{ items: PortfolioItem[] }> = ({ items }) => {
  const { addXP, gameState } = useConfig();
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const handleSelect = (item: PortfolioItem, e: React.MouseEvent) => {
    addXP(20, e.clientX, e.clientY);
    setSelectedItem(item);
    // Lock body scroll
    document.body.style.overflow = 'hidden';
  };

  const handleClose = () => {
    setSelectedItem(null);
    document.body.style.overflow = '';
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <>
      <div ref={gridRef} className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {items.map((item, index) => (
          <div 
            key={item.id}
            onClick={(e) => handleSelect(item, e)}
            className={`
              break-inside-avoid mb-6 group relative cursor-pointer portfolio-card 
              animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-backwards
              ${item.mediaType === 'game_godot' ? 'is-game' : ''}
            `}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Card Container */}
            <div className={`
              relative w-full overflow-hidden bg-stone-100 transition-all duration-500 group-hover:-translate-y-1
              ${gameState.mode === 'logic' 
                ? 'border-2 border-stone-900 rounded-none' 
                : 'rounded-3xl shadow-sm hover:shadow-2xl border border-stone-200/50'}
            `}>
                
                {/* Media */}
                <div className="relative">
                  {item.mediaType === 'image' ? (
                    <img 
                      src={item.url} 
                      alt={item.title} 
                      className="w-full h-auto object-cover block" 
                      loading="lazy" 
                    />
                  ) : item.mediaType === 'game_godot' ? (
                    <div className="w-full aspect-square relative bg-stone-900">
                      <img 
                        src={item.thumbnailUrl || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80'} 
                        alt={item.title} 
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" 
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                         <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 text-white group-hover:scale-110 transition-transform">
                            <Gamepad2 size={20} />
                         </div>
                      </div>
                    </div>
                  ) : (
                    <video 
                      src={item.url} 
                      className="w-full h-auto object-cover block" 
                      muted 
                      loop 
                      playsInline 
                      autoPlay 
                    />
                  )}
                  
                  {/* Hover Overlay - Instagram Style */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-center backdrop-blur-sm">
                      <h3 className="font-heading text-2xl text-white mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75 drop-shadow-lg">
                        {item.title}
                      </h3>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/80 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">
                        {item.category.replace(/_/g, ' ')}
                      </p>
                  </div>
                </div>

            </div>
          </div>
        ))}
      </div>

      {/* Modal Implementation */}
      {selectedItem && (
        <div className="fixed inset-0 z-[1000] flex justify-center animate-in fade-in duration-300">
           {/* Backdrop */}
           <div className="absolute inset-0 bg-stone-900/95 backdrop-blur-xl" onClick={handleClose}></div>
           
           {/* Scrollable Container */}
           <div className="relative w-full h-full overflow-y-auto overflow-x-hidden p-6 md:p-12">
              <div className="min-h-full flex items-center justify-center py-8">
                  <div className="max-w-6xl w-full grid lg:grid-cols-12 gap-8 lg:gap-12 items-start lg:items-center relative">
                     
                     {/* Close Button Mobile/Desktop */}
                     <button 
                        onClick={handleClose} 
                        className="fixed top-6 right-6 z-[1010] p-3 text-white/50 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-all backdrop-blur-md"
                     >
                        <X size={24} />
                     </button>

                     {/* Preview Area */}
                     <div className={`lg:col-span-8 overflow-hidden bg-stone-950 shadow-2xl ${gameState.mode === 'logic' ? 'border-4 border-white' : 'rounded-3xl'} w-full relative`}>
                        {selectedItem.mediaType === 'image' ? (
                          <img src={selectedItem.url} className="w-full h-auto object-contain max-h-[80vh]" alt={selectedItem.title} />
                        ) : selectedItem.mediaType === 'game_godot' ? (
                          <div className="aspect-video w-full">
                            <iframe 
                                src={selectedItem.url} 
                                className="w-full h-full border-none"
                                allow="autoplay; fullscreen; keyboard; gamepad"
                                title={selectedItem.title}
                            />
                          </div>
                        ) : (
                          <video src={selectedItem.url} className="w-full h-auto max-h-[80vh] object-contain" controls autoPlay loop playsInline />
                        )}
                     </div>
                     
                     {/* Info Sidebar */}
                     <div className="lg:col-span-4 space-y-8 text-white w-full">
                        <div className="space-y-4">
                            <span className="text-accent font-bold uppercase tracking-[0.3em] text-[10px]">
                              {selectedItem.mediaType === 'game_godot' ? 'Interactive Entity' : 'Project Detail'}
                            </span>
                            <h2 className="font-heading text-3xl md:text-5xl tracking-tighter leading-tight">{selectedItem.title}</h2>
                            <p className="font-body text-white/70 text-base font-light leading-relaxed max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                              {selectedItem.description}
                            </p>
                        </div>
                        
                        <div className={`p-6 space-y-4 ${gameState.mode === 'logic' ? 'bg-white/10 border-2 border-white/20' : 'bg-white/5 rounded-[2rem] border border-white/10'}`}>
                            <div><p className="text-[9px] font-bold uppercase tracking-widest text-white/30 mb-1">Discipline</p><p className="font-bold">{selectedItem.category.replace(/_/g, ' ')}</p></div>
                            <div>
                                <p className="text-[9px] font-bold uppercase tracking-widest text-white/30 mb-1">Tools</p>
                                <div className="flex flex-wrap gap-2">
                                  {selectedItem.metadata?.tools?.map(tool => (
                                    <span key={tool} className="text-xs px-2 py-1 bg-white/10 rounded-md text-accent">{tool}</span>
                                  )) || <span className="text-xs text-white/50">Standard Suite</span>}
                                </div>
                            </div>
                            {selectedItem.mediaType === 'game_godot' && (
                              <div className="flex items-center gap-3 py-2 px-3 bg-accent/10 border border-accent/20 rounded-xl mt-2">
                                <Zap size={14} className="text-accent animate-pulse" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-accent">Godot Engine Web WASM</span>
                              </div>
                            )}
                        </div>
                     </div>
                  </div>
              </div>
           </div>
        </div>
      )}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #57534e; border-radius: 4px; }
      `}</style>
    </>
  );
};
