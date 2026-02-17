import React, { useEffect, useState } from 'react';
import { blogService } from '../services/supabaseService';
import { BlogPost } from '../types';
import { ArrowRight } from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';

interface JournalSectionProps {
    onNavigate: (page: string) => void;
    scrollY?: number;
}

export const JournalSection: React.FC<JournalSectionProps> = ({ onNavigate, scrollY = 0 }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const { config } = useConfig();

  useEffect(() => {
      blogService.getAll().then(data => setPosts(data.slice(0, 3)));
  }, []);

  if (posts.length === 0) return null;

  return (
    <section className="w-full py-24 md:py-36 bg-paper relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-16">
            <div className="flex justify-between items-end mb-16">
                 <div>
                    <span className="text-accent text-[10px] font-bold uppercase tracking-[0.25em] mb-4 block">
                        {config.journal.sectionTitle}
                    </span>
                    <h2 className="font-heading text-5xl md:text-6xl text-stone-900 leading-none">
                        {config.journal.headline}
                    </h2>
                 </div>
                 <button onClick={() => onNavigate('blog')} className="hidden md:flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 hover:text-stone-900 transition-colors">
                     View All <ArrowRight size={14} />
                 </button>
            </div>
            
            <div className="grid md:grid-cols-3 gap-10">
                {posts.map((post, idx) => {
                    // Staggered parallax movement
                    const cardOffset = (scrollY - 3200) * (0.05 + idx * 0.02);
                    
                    return (
                        <div 
                            key={post.id} 
                            className="group cursor-pointer will-change-transform" 
                            onClick={() => onNavigate('blog')}
                            style={{ transform: `translateY(${Math.max(-50, Math.min(50, cardOffset))}px)` }}
                        >
                            <div className="aspect-[4/3] bg-stone-100 rounded-[1.5rem] overflow-hidden mb-6 border border-stone-200/50 relative shadow-lg group-hover:shadow-xl transition-all duration-500">
                                <img 
                                    src={post.coverImage || 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=600&q=80'} 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0 will-change-transform" 
                                    alt={post.title} 
                                    style={{ transform: `scale(${1 + Math.abs(cardOffset) * 0.0005})` }}
                                />
                            </div>
                            <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.15em] text-accent mb-3">
                                <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                            </div>
                            <h3 className="font-heading text-2xl text-stone-900 mb-3 group-hover:text-accent transition-colors leading-tight">{post.title}</h3>
                            <p className="text-stone-500 font-light leading-relaxed line-clamp-3 text-sm">{post.excerpt}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    </section>
  );
};