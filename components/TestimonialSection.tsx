import React, { useState, useEffect } from 'react';
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';
import { testimonialService } from '../services/supabaseService';
import { Testimonial } from '../types';

interface TestimonialSectionProps {
    scrollY?: number;
}

export const TestimonialSection: React.FC<TestimonialSectionProps> = ({ scrollY = 0 }) => {
  const { config } = useConfig();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    testimonialService.getAll().then(setTestimonials);
  }, []);

  const next = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  // Fallback to config if no DB testimonials exist
  const current = testimonials.length > 0 ? testimonials[currentIndex] : {
      content: config.testimonial.quote,
      client_name: config.testimonial.author,
      client_role: config.testimonial.role,
      rating: 5
  };

  if (!current.content) return null;

  const iconOffset = (scrollY - 2500) * 0.15;

  return (
    <section id="testimonial-section" className="w-full py-24 md:py-36 bg-paper border-y border-stone-200 relative overflow-hidden">
        <div 
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.03] will-change-transform"
            style={{ transform: `translate(-50%, calc(-50% + ${iconOffset}px))` }}
        >
            <Quote size={600} />
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-16 text-center relative z-10">
            <div className="flex justify-center mb-12">
                <div className="flex gap-1 text-accent">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < current.rating ? "currentColor" : "none"} className={i < current.rating ? 'animate-pulse' : 'opacity-20'} />
                    ))}
                </div>
            </div>

            <div key={currentIndex} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h3 className="font-heading text-4xl md:text-6xl text-stone-800 leading-tight max-w-4xl mx-auto mb-12 italic">
                    "{current.content}"
                </h3>
                <div className="flex flex-col items-center gap-2">
                    <p className="font-bold text-stone-900 uppercase tracking-widest text-sm">{current.client_name}</p>
                    <p className="font-body text-stone-400 text-xs uppercase tracking-widest font-bold opacity-60">{current.client_role}</p>
                </div>
            </div>

            {testimonials.length > 1 && (
                <div className="flex justify-center gap-6 mt-16">
                    <button onClick={prev} className="p-4 rounded-full border border-stone-100 hover:bg-stone-900 hover:text-white transition-all">
                        <ChevronLeft size={20} />
                    </button>
                    <button onClick={next} className="p-4 rounded-full border border-stone-100 hover:bg-stone-900 hover:text-white transition-all">
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}
        </div>
    </section>
  );
};