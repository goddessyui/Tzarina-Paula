
import React, { useEffect, useRef } from 'react';
import { useConfig } from '../contexts/ConfigContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
    Code2,
    Palette,
    BrainCircuit,
    Fingerprint,
    ShieldAlert,
    Download,
    Terminal,
    Zap
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const BioSection: React.FC = () => {
    const { config, gameState } = useConfig();
    const { bio } = config;
    
    const containerRef = useRef<HTMLDivElement>(null);
    const leftColRef = useRef<HTMLDivElement>(null);
    const rightColRef = useRef<HTMLDivElement>(null);
    
    const logicBarRef = useRef<HTMLDivElement>(null);
    const creativeBarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const mm = gsap.matchMedia();
        
        // Desktop: Pin the left profile card
        mm.add("(min-width: 1024px)", () => {
             ScrollTrigger.create({
                trigger: containerRef.current,
                start: "top top",
                end: "bottom bottom",
                pin: leftColRef.current,
                pinSpacing: false,
                scrub: true // smooth pinning
            });
        });

        const ctx = gsap.context(() => {
            // Animate Skill Bars
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top center",
                    end: "center center",
                    scrub: 1
                }
            });

            if (logicBarRef.current && creativeBarRef.current) {
                tl.fromTo(logicBarRef.current, { width: "0%" }, { width: "95%", ease: "power2.out" })
                  .fromTo(creativeBarRef.current, { width: "0%" }, { width: "88%", ease: "power2.out" }, "<");
            }

            // Animate Paragraphs
            const paragraphs = gsap.utils.toArray('.bio-paragraph');
            paragraphs.forEach((p: any) => {
                gsap.fromTo(p, 
                    { opacity: 0.3, y: 30 },
                    { 
                        opacity: 1, 
                        y: 0, 
                        duration: 1,
                        scrollTrigger: {
                            trigger: p,
                            start: "top 85%",
                            end: "top 60%",
                            scrub: 1
                        }
                    }
                );
            });
        }, containerRef);

        return () => {
            mm.revert();
            ctx.revert();
        };
    }, []);

    const isLogic = gameState.mode === 'logic';

    return (
        <section 
            id="bio-section" 
            ref={containerRef} 
            className="relative w-full bg-paper py-12 md:py-24 lg:py-32 overflow-hidden"
        >
            <div className="container-max relative z-10">
                <div className="flex flex-col lg:grid lg:grid-cols-12 gap-12 lg:gap-24 items-start">
                    
                    {/* LEFT COLUMN: PROFILE CARD */}
                    {/* Mobile: Full width, static. Desktop: Col-span-5, Pinned. */}
                    <div ref={leftColRef} className="w-full lg:col-span-5 relative z-20 flex flex-col">
                        <div className={`
                            relative overflow-hidden transition-all duration-700 w-full
                            ${isLogic 
                                ? 'border-2 border-stone-900 bg-stone-100' 
                                : 'bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl border border-stone-100'
                            }
                        `}>
                            {/* Card Header Decoration */}
                            <div className="h-3 bg-stone-900 w-full flex items-center justify-between px-4">
                                <div className="flex gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                </div>
                            </div>

                            {/* Image Container */}
                            <div className="relative aspect-[4/5] md:aspect-square lg:aspect-[4/5] xl:aspect-square group overflow-hidden bg-stone-200">
                                <img 
                                    src={bio.profileImage} 
                                    alt="Profile" 
                                    className={`
                                        w-full h-full object-cover transition-all duration-1000
                                        ${isLogic ? 'grayscale contrast-125' : 'grayscale-0'}
                                        group-hover:scale-105
                                    `}
                                />
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-stone-900/10 to-stone-900/80 pointer-events-none" />
                                
                                {/* Overlay Text on Image */}
                                <div className="absolute bottom-6 left-6 right-6 text-white">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-[9px] font-mono uppercase tracking-widest opacity-70 mb-1">Subject ID</p>
                                            <h3 className="font-heading text-4xl md:text-5xl leading-none">Tzarina<br/>Paula.</h3>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] font-mono uppercase tracking-widest opacity-70 mb-1">Level</p>
                                            <span className="text-3xl font-heading text-accent">{gameState.level}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Stats / Skills Section */}
                            <div className="p-6 md:p-8 space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-2xl ${isLogic ? 'bg-stone-200' : 'bg-accent/10 text-accent'}`}>
                                        <Terminal size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm uppercase tracking-wide text-stone-900">Vision Bridge</h4>
                                        <p className="text-xs text-stone-500 font-mono mt-0.5">Translation: Human &lt;&gt; Tech</p>
                                    </div>
                                </div>

                                {/* Bars */}
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-stone-400">
                                            <span className="flex items-center gap-2"><Code2 size={12} /> Logic Core</span>
                                            <span>95%</span>
                                        </div>
                                        <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden border border-stone-200">
                                            <div ref={logicBarRef} className="h-full bg-stone-800" />
                                        </div>
                                        <p className="text-[10px] text-stone-400 truncate">{bio.skillsText1}</p>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-stone-400">
                                            <span className="flex items-center gap-2"><Palette size={12} /> Creative Soul</span>
                                            <span>88%</span>
                                        </div>
                                        <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden border border-stone-200">
                                            <div ref={creativeBarRef} className="h-full bg-accent" />
                                        </div>
                                        <p className="text-[10px] text-stone-400 truncate">{bio.skillsText2}</p>
                                    </div>
                                </div>
                                
                                <button className={`
                                    w-full py-4 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all
                                    ${isLogic ? 'bg-stone-900 text-white hover:bg-stone-700' : 'bg-white border-2 border-stone-100 hover:border-accent hover:text-accent text-stone-900 shadow-lg'}
                                `}>
                                    <Download size={16} /> Download Full CV
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: CONTENT */}
                    <div ref={rightColRef} className="w-full lg:col-span-7 flex flex-col justify-center pt-0 lg:py-12">
                        <div className="space-y-16 lg:space-y-24">
                            
                            {/* Headline Block */}
                            <div className="space-y-6">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-100 rounded-full text-[10px] font-bold uppercase tracking-widest text-stone-500">
                                    <BrainCircuit size={14} />
                                    <span>Identity Matrix</span>
                                </div>
                                <h2 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-stone-900 leading-[0.9] tracking-tighter break-words">
                                    {isLogic ? 'Clinical Precision.' : 'Creative Soul.'}<br/>
                                    <span className="text-stone-300">Human Heart.</span>
                                </h2>
                            </div>

                            {/* Text Blocks */}
                            <div className="space-y-12">
                                <div className="bio-paragraph border-l-4 border-stone-200 pl-6 md:pl-8 space-y-4">
                                    <h3 className="font-heading text-2xl md:text-3xl text-stone-800">The Pivot.</h3>
                                    <p className="text-stone-600 text-lg leading-relaxed">
                                        Imagine a world where a <strong>misplaced comma</strong> can change a medical diagnosis. That was my reality for 13 years in healthcare documentation. It taught me that <strong>perfect precision isn't optional—it's the baseline.</strong>
                                    </p>
                                </div>

                                <div className="bio-paragraph border-l-4 border-accent pl-6 md:pl-8 space-y-4">
                                    <h3 className="font-heading text-2xl md:text-3xl text-stone-800">The Vision Bridge.</h3>
                                    <p className="text-stone-600 text-lg leading-relaxed">
                                        I understand that many clients have a brilliant vision but lack the technical vocabulary to build it. My process is deeply collaborative—I act as the technical liaison that turns your abstract ideas into high-fidelity digital reality.
                                    </p>
                                </div>

                                <div className="bio-paragraph border-l-4 border-stone-900 pl-6 md:pl-8 space-y-4">
                                    <h3 className="font-heading text-2xl md:text-3xl text-stone-800">Leadership.</h3>
                                    <p className="text-stone-600 text-lg leading-relaxed">
                                        During my BSIT studies, I frequently stepped into <strong>Project Lead roles</strong>, coordinating teams to ensure that complex logic met beautiful execution. I carry this discipline into every artistic commission.
                                    </p>
                                </div>
                            </div>

                            {/* Alert Box */}
                            <div className="bio-paragraph relative overflow-hidden group">
                                <div className={`
                                    p-6 md:p-10 rounded-[2rem] border-2 transition-all duration-500 relative z-10
                                    ${isLogic ? 'bg-stone-50 border-stone-200' : 'bg-stone-900 border-stone-900 text-white'}
                                `}>
                                    <div className="flex flex-col sm:flex-row items-start gap-6">
                                        <div className={`
                                            p-4 rounded-full shrink-0 animate-pulse
                                            ${isLogic ? 'bg-red-100 text-red-600' : 'bg-accent text-stone-900'}
                                        `}>
                                            <ShieldAlert size={32} />
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex flex-col">
                                                <span className={`text-[9px] font-black uppercase tracking-[0.3em] ${isLogic ? 'text-red-500' : 'text-accent'}`}>Integrity Protocol</span>
                                                <h3 className="font-heading text-2xl md:text-3xl">Generative AI Restricted.</h3>
                                            </div>
                                            <p className={`font-mono text-xs md:text-sm leading-relaxed ${isLogic ? 'text-stone-500' : 'text-stone-400'}`}>
                                                SYSTEM NOTICE: This portfolio contains 0% AI-generated imagery. 
                                                I believe art is a projection of the human soul. Every piece here is crafted by hand, heart, and human error.
                                                Prioritizing the inimitable spark of creation that no algorithm can replicate.
                                            </p>
                                            <div className="flex items-center gap-2 pt-2">
                                                <Fingerprint size={16} className={isLogic ? 'text-stone-400' : 'text-stone-500'} />
                                                <span className="text-[9px] font-bold uppercase tracking-widest opacity-50">Verified Human_087</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Background Elements */}
                            <div className="hidden lg:flex justify-end opacity-20 select-none pointer-events-none absolute bottom-0 right-0">
                                <Zap size={120} />
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            
            {/* Background Texture Overlay */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]" />
        </section>
    );
};
