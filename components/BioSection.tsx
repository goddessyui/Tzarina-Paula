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
    
    // Skill Refs for animation
    const logicBarRef = useRef<HTMLDivElement>(null);
    const creativeBarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const isDesktop = window.innerWidth >= 1024;

            if (isDesktop) {
                // Pin the left column (Dossier) while scrolling the right column
                ScrollTrigger.create({
                    trigger: containerRef.current,
                    start: "top top",
                    end: "bottom bottom",
                    pin: leftColRef.current,
                    pinSpacing: false,
                });
            }

            // Animate Skill Bars based on scroll position within the section
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top center",
                    end: "center center",
                    scrub: 1.5
                }
            });

            if (logicBarRef.current && creativeBarRef.current) {
                tl.fromTo(logicBarRef.current, { width: "0%" }, { width: "95%", ease: "power2.out" })
                  .fromTo(creativeBarRef.current, { width: "0%" }, { width: "88%", ease: "power2.out" }, "<");
            }

            // Text Reveal Animation for right column paragraphs
            const paragraphs = gsap.utils.toArray('.bio-paragraph');
            paragraphs.forEach((p: any) => {
                gsap.fromTo(p, 
                    { opacity: 0.3, y: 20 },
                    { 
                        opacity: 1, 
                        y: 0, 
                        duration: 1,
                        scrollTrigger: {
                            trigger: p,
                            start: "top 80%",
                            end: "top 50%",
                            scrub: 1
                        }
                    }
                );
            });

        }, containerRef);
        return () => ctx.revert();
    }, []);

    const isLogic = gameState.mode === 'logic';

    return (
        <section 
            id="bio-section" 
            ref={containerRef} 
            className="relative w-full min-h-screen bg-paper py-24 md:py-32 overflow-hidden"
        >
            <div className="container-max relative z-10">
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-24">
                    
                    {/* LEFT COLUMN: THE DOSSIER (PINNED) */}
                    <div ref={leftColRef} className="lg:col-span-5 h-fit lg:h-screen lg:max-h-[800px] flex flex-col justify-center">
                        <div className={`
                            relative overflow-hidden transition-all duration-700
                            ${isLogic ? 'border-2 border-stone-900 bg-stone-100' : 'bg-white rounded-[3rem] shadow-2xl border border-stone-100'}
                        `}>
                            {/* Decorative Header */}
                            <div className="h-2 bg-stone-900 w-full flex items-center justify-between px-4">
                                <div className="flex gap-1">
                                    <div className="w-1 h-1 rounded-full bg-red-500 animate-pulse" />
                                    <div className="w-1 h-1 rounded-full bg-yellow-500" />
                                    <div className="w-1 h-1 rounded-full bg-green-500" />
                                </div>
                            </div>

                            {/* Profile Image Area */}
                            <div className="relative aspect-square group overflow-hidden">
                                <img 
                                    src={bio.profileImage} 
                                    alt="Profile" 
                                    className={`
                                        w-full h-full object-cover transition-all duration-1000
                                        ${isLogic ? 'grayscale contrast-125' : 'grayscale-0'}
                                        group-hover:scale-105
                                    `}
                                />
                                {/* Scanline Effect Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-stone-900/10 to-stone-900/60 pointer-events-none" />
                                {isLogic && <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay" />}
                                
                                <div className="absolute bottom-6 left-6 right-6 text-white">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-[9px] font-mono uppercase tracking-widest opacity-70 mb-1">Subject ID</p>
                                            <h3 className="font-heading text-4xl leading-none">Tzarina<br/>Paula.</h3>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] font-mono uppercase tracking-widest opacity-70 mb-1">Level</p>
                                            <span className="text-3xl font-heading text-accent">{gameState.level}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Stats & Skills */}
                            <div className="p-8 md:p-10 space-y-8">
                                {/* Bio Snippet */}
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-2xl ${isLogic ? 'bg-stone-200' : 'bg-accent/10 text-accent'}`}>
                                        <Terminal size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm uppercase tracking-wide text-stone-900">Vision Bridge</h4>
                                        <p className="text-xs text-stone-500 font-mono mt-0.5">Translation: Human &lt;&gt; Tech</p>
                                    </div>
                                </div>

                                {/* Dynamic Skill Bars */}
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-stone-400">
                                            <span className="flex items-center gap-2"><Code2 size={10} /> Logic Core</span>
                                            <span>95%</span>
                                        </div>
                                        <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden border border-stone-200">
                                            <div ref={logicBarRef} className="h-full bg-stone-800" />
                                        </div>
                                        <p className="text-[10px] text-stone-400 truncate">{bio.skillsText1}</p>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-stone-400">
                                            <span className="flex items-center gap-2"><Palette size={10} /> Creative Soul</span>
                                            <span>88%</span>
                                        </div>
                                        <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden border border-stone-200">
                                            <div ref={creativeBarRef} className="h-full bg-accent" />
                                        </div>
                                        <p className="text-[10px] text-stone-400 truncate">{bio.skillsText2}</p>
                                    </div>
                                </div>
                                
                                {/* Download / Action */}
                                <button className={`
                                    w-full py-4 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all
                                    ${isLogic ? 'bg-stone-900 text-white hover:bg-stone-700' : 'bg-white border-2 border-stone-100 hover:border-accent hover:text-accent text-stone-900 shadow-lg'}
                                `}>
                                    <Download size={14} /> Download Full CV
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: THE NARRATIVE (SCROLLABLE) */}
                    <div ref={rightColRef} className="lg:col-span-7 flex flex-col justify-center py-12 lg:py-24">
                        <div className="space-y-24">
                            
                            {/* Headline */}
                            <div className="space-y-6">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-100 rounded-full text-[10px] font-bold uppercase tracking-widest text-stone-500">
                                    <BrainCircuit size={12} />
                                    <span>Identity Matrix</span>
                                </div>
                                <h2 className="font-heading text-6xl md:text-8xl text-stone-900 leading-[0.85] tracking-tighter">
                                    {isLogic ? 'Clinical Precision.' : 'Creative Soul.'}<br/>
                                    <span className="text-stone-300">Human Heart.</span>
                                </h2>
                            </div>

                            {/* Bio Content - Parsed into visual chunks */}
                            <div className="prose prose-lg md:prose-2xl prose-stone font-light leading-relaxed">
                                <div className="bio-paragraph border-l-4 border-stone-200 pl-8 md:pl-12 space-y-4">
                                    <h3 className="font-heading text-3xl text-stone-800">The Pivot.</h3>
                                    <p className="text-stone-600">
                                        Imagine a world where a <strong>misplaced comma</strong> can change a medical diagnosis. That was my reality for 13 years in healthcare documentation. It taught me that <strong>perfect precision isn't optional—it's the baseline.</strong>
                                    </p>
                                </div>

                                <div className="bio-paragraph border-l-4 border-accent pl-8 md:pl-12 space-y-4">
                                    <h3 className="font-heading text-3xl text-stone-800">The Vision Bridge.</h3>
                                    <p className="text-stone-600">
                                        I understand that many clients have a brilliant vision but lack the technical vocabulary to build it. My process is deeply collaborative—I act as the technical liaison that turns your abstract ideas into high-fidelity digital reality.
                                    </p>
                                </div>

                                <div className="bio-paragraph border-l-4 border-stone-900 pl-8 md:pl-12 space-y-4">
                                    <h3 className="font-heading text-3xl text-stone-800">Leadership.</h3>
                                    <p className="text-stone-600">
                                        During my BSIT studies, I frequently stepped into <strong>Project Lead roles</strong>, coordinating teams to ensure that complex logic met beautiful execution. I carry this discipline into every artistic commission.
                                    </p>
                                </div>
                            </div>

                            {/* Anti-AI Statement (Styled as Alert) */}
                            <div className="bio-paragraph relative overflow-hidden group">
                                <div className={`
                                    p-8 md:p-12 rounded-[2rem] border-2 transition-all duration-500 relative z-10
                                    ${isLogic ? 'bg-stone-50 border-stone-200' : 'bg-stone-900 border-stone-900 text-white'}
                                `}>
                                    <div className="flex items-start gap-6">
                                        <div className={`
                                            p-4 rounded-full shrink-0 animate-pulse
                                            ${isLogic ? 'bg-red-100 text-red-600' : 'bg-accent text-stone-900'}
                                        `}>
                                            <ShieldAlert size={24} />
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex flex-col">
                                                <span className={`text-[9px] font-black uppercase tracking-[0.3em] ${isLogic ? 'text-red-500' : 'text-accent'}`}>Integrity Protocol</span>
                                                <h3 className="font-heading text-3xl md:text-4xl">Generative AI Restricted.</h3>
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
                                {/* Background decoration */}
                                <div className="absolute -inset-1 bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-700" />
                            </div>

                            {/* "XP" Decor element */}
                            <div className="flex justify-end opacity-20 select-none pointer-events-none">
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