
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { PortfolioGrid } from './PortfolioGrid';
import { PortfolioItem, PortfolioCategory } from '../types';
import { Layers, PenTool, Film, Video, Monitor, Plus, Star } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface PortfolioSectionProps {
  items: PortfolioItem[];
  scrollY?: number;
}

type FilterTab = 'all' | PortfolioCategory;
const ITEMS_PER_PAGE = 15;

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({ items, scrollY = 0 }) => {
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [activeTab]);

  const featuredItems = useMemo(() => 
    items.filter(i => i.isFeatured).sort((a, b) => (a.featuredOrder || 99) - (b.featuredOrder || 99))
  , [items]);

  const filteredItems = useMemo(() => {
      if (activeTab === 'all') {
          return items.sort((a, b) => new Date(b.dateCreated || b.createdAt).getTime() - new Date(a.dateCreated || a.createdAt).getTime());
      }
      return items.filter(item => item.category === activeTab)
                 .sort((a, b) => new Date(b.dateCreated || b.createdAt).getTime() - new Date(a.dateCreated || a.createdAt).getTime());
  }, [items, activeTab]);

  const paginatedItems = useMemo(() => filteredItems.slice(0, visibleCount), [filteredItems, visibleCount]);

  useEffect(() => {
    if (!sectionRef.current) return;
    const resizeObserver = new ResizeObserver(() => ScrollTrigger.refresh());
    resizeObserver.observe(sectionRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  const getCount = (tabId: FilterTab) => {
      if (tabId === 'all') return items.length;
      return items.filter(i => i.category === tabId).length;
  };

  const loadMore = () => setVisibleCount(prev => prev + ITEMS_PER_PAGE);

  const filterOptions: { id: FilterTab; label: string; icon: React.ElementType }[] = [
      { id: 'all', label: 'All Projects', icon: Layers },
      { id: 'illustration', label: 'Illustration', icon: PenTool },
      { id: 'motion_graphics_animation', label: 'Motion', icon: Film },
      { id: 'graphic_design', label: 'Branding', icon: Layers },
      { id: 'video_editing', label: 'Cuts', icon: Video },
      { id: 'web_app_development', label: 'Interactive', icon: Monitor },
  ];

  return (
    <div ref={sectionRef} id="portfolio-section" className="w-full py-24 md:py-36 bg-paper relative transition-all duration-500 ease-out flex flex-col">
        
        {/* 1. SELECTED WORKS (SPOTLIGHT) */}
        {featuredItems.length > 0 && activeTab === 'all' && (
            <section className="container-responsive max-w-7xl mb-36 w-full flex-none">
                <div 
                    className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20 will-change-transform"
                    style={{ transform: `translateY(${Math.max(0, (scrollY - 200) * -0.05)}px)` }}
                >
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-3 px-5 py-2 bg-accent/10 rounded-full text-accent text-[10px] font-bold uppercase tracking-[0.2em] border border-accent/20">
                            <Star size={12} fill="currentColor" className="animate-pulse"/> Spotlight Gallery
                        </div>
                        <h2 className="font-heading text-5xl md:text-6xl text-stone-900 leading-[1] tracking-tight">Iconic Bits.</h2>
                    </div>
                    <p className="text-stone-500 font-body text-lg md:text-xl max-w-md md:text-right font-light leading-relaxed">
                        A definitive selection of projects representing the intersection of artistic vision and technical rigor.
                    </p>
                </div>
                <div 
                    className="will-change-transform transition-transform duration-700 ease-out"
                    style={{ transform: `translateY(${Math.max(0, (scrollY - 400) * -0.02)}px)` }}
                >
                    <PortfolioGrid items={featuredItems} />
                </div>
                <div className="w-full h-px bg-stone-200/50 mt-24"></div>
            </section>
        )}

        {/* 2. ARCHIVE SECTION */}
        <section className="relative w-full flex-auto flex flex-col">
            <div className="container-responsive max-w-7xl w-full flex-none">
                <div className="mb-20 flex justify-center">
                    <div className="inline-flex flex-wrap justify-center items-center gap-2 p-2 bg-white rounded-full border border-stone-200/50 shadow-lg shadow-stone-200/5">
                        {filterOptions.map((option) => {
                            const isActive = activeTab === option.id;
                            const count = getCount(option.id);
                            if (count === 0 && option.id !== 'all') return null;

                            return (
                                <button
                                    key={option.id}
                                    onClick={() => setActiveTab(option.id)}
                                    className={`px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] transition-all duration-500 scale-100 active:scale-95
                                        ${isActive 
                                            ? 'bg-stone-900 text-white shadow-md' 
                                            : 'text-stone-400 hover:text-stone-900 hover:bg-stone-50'}`}
                                >
                                    <span className="flex items-center gap-2">
                                        {option.label}
                                        <span className={`text-[9px] ${isActive ? 'text-white/40' : 'text-stone-300'}`}>{count}</span>
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="w-full min-h-[400px] flex-auto">
                {filteredItems.length > 0 ? (
                    <div key={activeTab} className="animate-in fade-in slide-in-from-bottom-10 duration-1000 flex flex-col h-full">
                        <div className="container-responsive max-w-7xl w-full">
                            <PortfolioGrid items={paginatedItems} />
                        </div>
                        
                        {visibleCount < filteredItems.length && (
                            <div className="mt-24 flex justify-center pb-16">
                                <button onClick={loadMore} className="flex items-center gap-3 px-10 py-5 bg-stone-900 text-white rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-accent hover:text-stone-900 transition-all shadow-xl hover:-translate-y-1 active:translate-y-0">
                                    <Plus size={16}/> Load Archive
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="container-responsive max-w-7xl text-center py-32 text-stone-300">
                        <p className="font-body italic text-xl font-light tracking-wide">Workspace is currently occupied. Content arriving soon.</p>
                    </div>
                )}
            </div>
        </section>
    </div>
  );
};
