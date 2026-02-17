import React from 'react';
import { useConfig } from '../contexts/ConfigContext';
import { ArrowRight, BookOpen, Sparkles } from 'lucide-react';

interface StorySpotlightSectionProps {
  onNavigate: (page: string) => void;
}

export const StorySpotlightSection: React.FC<StorySpotlightSectionProps> = ({ onNavigate }) => {
  const { config } = useConfig();
  const { story } = config;

  return (
    <section id="stories-section" className="relative w-full py-24 md:py-36 bg-stone-900 text-white overflow-hidden">
        {/* Subtle decorative background */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:40px_40px]"></div>
        
        <div className="max-w-7xl mx-auto px-6 md:px-16 relative z-10">
            <div className="grid lg:grid-cols-2 gap-20 md:gap-32 items-center">
                
                {/* Visual Side */}
                <div className="relative group cursor-pointer" onClick={() => onNavigate('stories')}>
                    <div className="absolute -inset-4 bg-accent/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                    <div className="relative aspect-[3/4] rounded-2xl md:rounded-[3rem] overflow-hidden border-[8px] md:border-[12px] border-white/5 shadow-2xl transition-transform duration-1000 group-hover:-rotate-2 group-hover:scale-105">
                        <img src={story.frontCoverUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" alt="Story Cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-end p-12">
                            <span className="font-heading text-4xl text-white">Enter the Narrative.</span>
                        </div>
                    </div>
                </div>

                {/* Content Side */}
                <div className="space-y-12">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-3 px-4 py-2 bg-accent text-stone-900 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-lg shadow-accent/20 animate-in fade-in slide-in-from-left-4">
                            <BookOpen size={14} /> Masterpiece Showcase
                        </div>
                        <h2 className="font-heading text-6xl md:text-8xl text-white leading-[0.8] tracking-tighter">
                            {story.title}
                        </h2>
                    </div>

                    <p className="text-stone-400 font-body text-xl md:text-2xl font-light italic leading-relaxed border-l-4 border-accent/30 pl-10 max-w-xl">
                        {story.synopsis}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                        <button 
                            onClick={() => onNavigate('stories')}
                            className="group flex items-center gap-6 px-10 py-6 bg-white text-stone-900 rounded-full font-black uppercase tracking-[0.3em] text-[10px] hover:bg-accent transition-all shadow-xl hover:-translate-y-1 active:scale-95"
                        >
                            Open Cinematic View <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                        </button>
                        
                        <div className="flex items-center gap-4 text-stone-500 font-mono text-[9px] uppercase tracking-widest pl-4">
                            <Sparkles size={14} className="text-accent animate-pulse" />
                            <span>v2.4_DYNAMO_ENGINE</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </section>
  );
};