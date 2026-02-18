
import React, { useEffect, useState } from 'react';
import { blogService } from '../services/supabaseService';
import { BlogPost } from '../types';
import { MapPin, ChevronLeft, FileText, Share2, Bookmark, ArrowRight } from 'lucide-react';
import { BongoCatLoader } from '../components/BongoCatLoader';
import { SEOManager } from '../components/SEOManager';

interface BlogPageProps {
  onNavigate: (page: string) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ onNavigate }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePost, setActivePost] = useState<BlogPost | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
          const data = await blogService.getAll();
          setPosts(data);
      } catch (err) {
          console.error("Failed to load blog posts");
      } finally {
          setTimeout(() => setLoading(false), 1200);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return <BongoCatLoader />;

  if (activePost) {
    return (
        <div className="min-h-screen bg-paper pt-36 pb-24 relative">
            <SEOManager override={{
                title: activePost.title,
                description: activePost.excerpt,
                image: activePost.coverImage,
                type: 'article',
                publishedAt: activePost.publishedAt,
                tags: activePost.tags
            }} />
            
            <div className="container-responsive max-w-4xl mb-16 flex justify-between items-center">
                <button 
                    onClick={() => setActivePost(null)}
                    className="flex items-center gap-4 text-stone-400 hover:text-stone-900 transition-all uppercase tracking-[0.25em] text-[9px] font-bold group"
                >
                    <div className="p-2.5 rounded-full bg-stone-50 border border-stone-100 group-hover:scale-110 transition-transform">
                        <ChevronLeft size={14} />
                    </div>
                    Journal Index
                </button>
                <div className="flex gap-4">
                    <button className="p-2.5 text-stone-300 hover:text-stone-900 transition-colors"><Bookmark size={18}/></button>
                    <button className="p-2.5 text-stone-300 hover:text-stone-900 transition-colors"><Share2 size={18}/></button>
                </div>
            </div>

            <article className="container-responsive max-w-4xl">
                <header className="mb-20 text-center">
                    <div className="flex justify-center items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-accent mb-8">
                         <span>{new Date(activePost.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                         {activePost.geoTag && <span className="w-1 h-1 rounded-full bg-stone-200"></span>}
                         {activePost.geoTag && <span className="flex items-center text-stone-400"><MapPin size={10} className="mr-2"/> {activePost.geoTag}</span>}
                    </div>
                    <h1 className="font-heading text-5xl md:text-[5rem] text-stone-900 leading-[1] tracking-tight mb-12">{activePost.title}</h1>
                    <div className="flex justify-center flex-wrap gap-2">
                         {activePost.tags && activePost.tags.map(tag => (
                             <span key={tag} className="border border-stone-200 text-stone-400 px-5 py-2 rounded-full text-[9px] uppercase tracking-widest font-bold">
                                 {tag}
                             </span>
                         ))}
                    </div>
                </header>

                {activePost.coverImage && (
                    <div className="w-full aspect-[21/9] bg-stone-100 rounded-[2rem] overflow-hidden mb-20 shadow-2xl relative">
                        <img src={activePost.coverImage} className="w-full h-full object-cover" alt={activePost.title} />
                        <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-[2rem]"></div>
                    </div>
                )}

                <div className="grid md:grid-cols-12 gap-16">
                    <aside className="md:col-span-3 hidden md:block border-t border-stone-900 pt-6">
                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-300 mb-4">Article Summary</p>
                        <p className="font-body text-stone-800 text-sm font-medium leading-relaxed italic">
                            {activePost.excerpt}
                        </p>
                    </aside>
                    
                    <div className="md:col-span-8 md:col-start-5 prose prose-stone max-w-none">
                        <div className="font-body text-stone-600 text-lg md:text-xl leading-[1.8] font-light space-y-8 first-letter:text-6xl first-letter:font-heading first-letter:text-stone-900 first-letter:mr-3 first-letter:float-left first-letter:leading-[0.8]">
                            {activePost.content ? (
                                activePost.content.split('\n').map((paragraph, idx) => (
                                    <p key={idx}>{paragraph}</p>
                                ))
                            ) : (
                                <p className="italic text-stone-400">Content loading from archives...</p>
                            )}
                        </div>
                    </div>
                </div>

                <footer className="mt-24 pt-16 border-t border-stone-100 flex flex-col md:flex-row justify-between items-start gap-12">
                     <div className="max-w-md">
                        <h4 className="font-heading text-3xl text-stone-900 mb-4 tracking-tight">Enjoyed the reading?</h4>
                        <p className="text-stone-500 font-body text-base leading-relaxed mb-8">I publish thoughts on the intersection of design and precision once a month.</p>
                        <button onClick={() => onNavigate('contact')} className="bg-stone-900 text-white px-8 py-4 rounded-full font-bold text-[9px] uppercase tracking-[0.2em] hover:bg-accent hover:text-stone-900 transition-all shadow-xl shadow-stone-200">Connect with Tzarina</button>
                     </div>
                     <div className="w-full md:w-56 aspect-square bg-stone-50 rounded-[2rem] flex items-center justify-center border border-stone-100 p-8 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                        <FileText size={64} className="text-stone-200" strokeWidth={0.5}/>
                     </div>
                </footer>
            </article>
        </div>
    );
  }

  return (
    <div className="min-h-screen pt-36 pb-24 relative bg-paper">
      <header className="container-responsive max-w-7xl text-center mb-24">
        <span className="text-accent text-xs font-bold uppercase tracking-[0.3em] mb-8 block">The Creative Log</span>
        <h1 className="font-heading text-6xl md:text-[8rem] text-stone-900 leading-[0.8] tracking-tight mb-12">Journal.</h1>
        <p className="text-stone-400 font-body text-lg md:text-2xl font-light tracking-wide max-w-2xl mx-auto leading-tight italic">
          Reflections on the digital canvas, code structures, and the whimsy found within technical precision.
        </p>
      </header>

      <div className="container-responsive max-w-7xl">
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 gap-24">
            {posts.map((post, index) => (
              <article key={post.id} className="group relative">
                <div className={`md:flex items-center gap-16 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                    <div 
                        className="md:w-7/12 aspect-[4/3] rounded-[2.5rem] overflow-hidden bg-stone-100 cursor-pointer shadow-xl group-hover:shadow-stone-900/10 transition-all duration-1000 relative"
                        onClick={() => setActivePost(post)}
                    >
                        <img 
                            src={post.coverImage || 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80'} 
                            className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110" 
                            alt={post.title} 
                        />
                        <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-transparent transition-colors duration-1000"></div>
                    </div>
                    
                    <div className="md:w-5/12 py-10 md:py-0">
                        <div className="flex items-center gap-3 text-[9px] font-bold text-accent uppercase tracking-[0.2em] mb-6">
                            <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            <span className="w-1 h-1 bg-stone-200 rounded-full"></span>
                            <span className="text-stone-400">{post.geoTag}</span>
                        </div>
                        
                        <h2 className="font-heading text-4xl md:text-5xl text-stone-900 mb-6 leading-[1] tracking-tight cursor-pointer hover:text-accent transition-colors" onClick={() => setActivePost(post)}>{post.title}</h2>
                        <p className="font-body text-stone-500 text-base md:text-lg leading-relaxed font-light mb-10 line-clamp-3">{post.excerpt}</p>

                        <button onClick={() => setActivePost(post)} className="flex items-center gap-5 group/btn">
                            <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-stone-900 border-b-2 border-stone-900 pb-1 group-hover/btn:border-accent group-hover/btn:text-accent transition-colors">Read Article</span>
                            <div className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center text-stone-300 group-hover/btn:bg-accent group-hover/btn:border-accent group-hover/btn:text-stone-900 transition-all group-hover/btn:translate-x-2">
                                <ArrowRight size={16} />
                            </div>
                        </button>
                    </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-48 bg-white rounded-[4rem] border border-dashed border-stone-200">
              <FileText size={64} className="mx-auto mb-8 text-stone-100" />
              <p className="font-heading text-4xl text-stone-300">The ink is still drying.</p>
          </div>
        )}
      </div>
    </div>
  );
};
