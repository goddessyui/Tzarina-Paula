
import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle, AlertCircle, Send, MessageCircle, ShieldCheck, ShieldAlert, Wifi } from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';
import { AvailabilityGauge } from './AvailabilityGauge';
import { contactService } from '../services/supabaseService';

const DAILY_LIMIT = 10;

export const ContactSection: React.FC = () => {
  const { config } = useConfig();
  
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '', honeypot: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error' | 'missing_config' | 'limit_reached'>('idle');
  const [submissionsToday, setSubmissionsToday] = useState(0);

  useEffect(() => {
    const checkLimit = async () => {
        try {
            const count = await contactService.getTodayCount();
            setSubmissionsToday(count);
            if (count >= DAILY_LIMIT) setStatus('limit_reached');
        } catch (e) {
            console.warn("Could not reach Rate Limit Service. Defaulting to open bandwidth.", e);
        }
    };
    checkLimit();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Security: Honeypot check (anti-spam)
    if (formData.honeypot) {
        console.warn("Spam attempt blocked by honeypot.");
        return;
    }

    if (!config.contact.formspreeId || config.contact.formspreeId.includes("ADD_YOUR")) {
        setStatus('missing_config');
        return;
    }

    if (submissionsToday >= DAILY_LIMIT) {
        setStatus('limit_reached');
        return;
    }
    
    setStatus('submitting');
    try {
      // Security: Attempt to log submission to Supabase for rate limiting (non-blocking)
      try {
          await contactService.logSubmission();
      } catch (dbError) {
          console.error("Rate Limit Service Unavailable:", dbError);
      }

      const response = await fetch(`https://formspree.io/f/${config.contact.formspreeId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
            name: formData.name, 
            email: formData.email,
            message: formData.message, 
            _subject: formData.subject || `Inquiry from ${formData.name}`,
        })
      });

      if (response.ok) {
          setStatus('success');
          setSubmissionsToday(prev => prev + 1);
      } else {
          setStatus('error');
      }
    } catch (e) { 
        console.error("Submission error:", e);
        setStatus('error'); 
    }
  };

  const remainingSignals = Math.max(0, DAILY_LIMIT - submissionsToday);

  return (
    <section id="contact-section" className="py-24 md:py-36 relative overflow-hidden">
       
       <div className="container-responsive max-w-7xl flex flex-col items-center">
            <div className="text-center max-w-3xl mb-16 md:mb-24 space-y-6">
                <span className="text-accent text-[10px] font-black uppercase tracking-[0.4em] block">Final Protocol</span>
                <h2 className="text-section-title font-heading text-stone-950">
                    Let's build<br/><span className="italic text-stone-400">something iconic.</span>
                </h2>
            </div>

            <div className="w-full bg-white rounded-[2rem] md:rounded-[4rem] border border-stone-200 shadow-2xl overflow-hidden max-w-6xl relative z-10">
                <div className="absolute top-0 left-0 w-full h-3 bg-stone-950"></div>
                
                {status === 'success' ? (
                    <div className="p-16 md:p-24 text-center animate-in fade-in zoom-in-95">
                        <CheckCircle size={80} className="mx-auto mb-8 text-green-500"/>
                        <h2 className="text-4xl md:text-5xl font-heading mb-6 text-stone-900">Message Transmitted.</h2>
                        <p className="text-stone-500 mb-10 text-lg md:text-xl font-light">I'll review your brief and get back to you within 48 hours.</p>
                        <button 
                            onClick={() => { setStatus('idle'); setFormData({ name: '', email: '', subject: '', message: '', honeypot: '' }); }} 
                            className="text-stone-900 border-b-2 border-stone-950 pb-1 font-black uppercase tracking-widest text-[10px] hover:text-accent hover:border-accent transition-all"
                        >
                            Send Another Signal
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-5">
                        <div className="lg:col-span-2 bg-stone-50 p-10 md:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-stone-200">
                            <div className="space-y-12">
                                <AvailabilityGauge />

                                <div className="space-y-4">
                                    <h3 className="font-black uppercase tracking-widest text-[10px] text-stone-300">System Bandwidth</h3>
                                    <div className={`flex items-center gap-4 p-4 rounded-2xl border transition-colors ${remainingSignals === 0 ? 'bg-red-50 border-red-100 text-red-600' : 'bg-white border-stone-100'}`}>
                                        {remainingSignals === 0 ? <ShieldAlert size={20} /> : <ShieldCheck size={20} className="text-accent" />}
                                        <div className="flex-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest leading-none">
                                                {remainingSignals} / {DAILY_LIMIT} Signals Remaining
                                            </p>
                                            <div className="h-1 w-full bg-stone-100 rounded-full mt-2 overflow-hidden">
                                                <div 
                                                    className={`h-full transition-all duration-1000 ${remainingSignals < 3 ? 'bg-red-400' : 'bg-accent'}`}
                                                    style={{ width: `${(remainingSignals / DAILY_LIMIT) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-[8px] uppercase tracking-widest text-stone-400 font-bold ml-1">Daily transmission limit enforced for system stability.</p>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="font-black uppercase tracking-widest text-[10px] text-stone-300">Direct Protocol</h3>
                                    <a href={`mailto:${config.contact.email}`} className="text-stone-950 font-heading text-2xl md:text-3xl hover:text-accent transition-colors break-all border-b border-stone-200 pb-1">{config.contact.email}</a>
                                </div>

                                <div className="p-6 bg-stone-900 text-white rounded-[2rem] space-y-4 shadow-xl">
                                    <div className="flex items-center gap-3">
                                        <MessageCircle size={20} className="text-accent" />
                                        <h4 className="font-heading text-xl">The Human Bridge.</h4>
                                    </div>
                                    <p className="text-[10px] text-stone-400 font-medium leading-relaxed uppercase tracking-widest">
                                        I specialize in bridging the gap for non-technical clients. I am highly communicative—ensuring your vision is translated to art exactly as you imagine it.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-3 p-10 md:p-16 relative">
                            {status === 'submitting' && (
                                <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-[2px] flex items-center justify-center animate-in fade-in">
                                    <div className="flex flex-col items-center gap-6">
                                        <div className="relative">
                                            <Wifi size={48} className="text-stone-900 animate-pulse" />
                                            <div className="absolute inset-0 animate-ping bg-accent/20 rounded-full"></div>
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-900">Synchronizing Signal...</span>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="sr-only" aria-hidden="true">
                                    <label htmlFor="honeypot">Leave this field empty</label>
                                    <input id="honeypot" name="honeypot" tabIndex={-1} autoComplete="off" value={formData.honeypot} onChange={e => setFormData({...formData, honeypot: e.target.value})} />
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="block text-[10px] uppercase tracking-widest font-black text-stone-400">Full Name</label>
                                        <input className="input-c" name="name" placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="block text-[10px] uppercase tracking-widest font-black text-stone-400">Email Address</label>
                                        <input className="input-c" type="email" name="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="block text-[10px] uppercase tracking-widest font-black text-stone-400">Subject / Objective</label>
                                    <input className="input-c" name="subject" placeholder="What are we creating?" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} />
                                </div>
                                <div className="space-y-3">
                                    <label className="block text-[10px] uppercase tracking-widest font-black text-stone-400">Project Brief</label>
                                    <textarea rows={5} className="input-c resize-none" name="message" placeholder="Tell me about your goals, timeline, and vision." value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} required></textarea>
                                </div>
                                
                                {status === 'missing_config' && (
                                    <div className="bg-red-50 text-red-600 p-6 rounded-xl space-y-2 border border-red-100">
                                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"><AlertCircle size={14} /><span>Form Protocol Incomplete</span></div>
                                        <p className="text-[9px] text-red-500 font-bold uppercase tracking-widest leading-relaxed">The Formspree ID is missing from the configuration. Admin intervention required.</p>
                                    </div>
                                )}

                                {status === 'error' && (
                                    <div className="bg-red-50 text-red-600 p-6 rounded-xl space-y-2 border border-red-100">
                                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"><AlertCircle size={14} /><span>Network Interrupt Detected</span></div>
                                        <p className="text-[9px] text-red-500 font-bold uppercase tracking-widest leading-relaxed">A transmission error occurred. Please try again later or contact me directly via email.</p>
                                    </div>
                                )}

                                {status === 'limit_reached' && (
                                    <div className="bg-red-50 text-red-600 p-6 rounded-xl space-y-2 border border-red-100">
                                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-600"><ShieldAlert size={14} /><span>Daily Transmission Limit Reached</span></div>
                                        <p className="text-[9px] text-red-500 font-bold uppercase tracking-widest leading-relaxed">Protocol paused to prevent overload. Please try again tomorrow.</p>
                                    </div>
                                )}

                                <button 
                                    type="submit" 
                                    disabled={status === 'submitting' || status === 'limit_reached'} 
                                    className={`w-full py-6 rounded-2xl font-black uppercase tracking-[0.4em] text-xs transition-all flex items-center justify-center gap-4 shadow-xl active:scale-95 group 
                                        ${status === 'limit_reached' ? 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none' : 'bg-stone-950 text-white hover:bg-accent hover:text-stone-950'}
                                    `}
                                >
                                    {status === 'submitting' ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"/>}
                                    {status === 'submitting' ? 'Transmitting Signal...' : status === 'limit_reached' ? 'Protocol Paused' : 'Send Signal'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
       </div>
       
       <style>{`
        .input-c { width: 100%; padding: 1.25rem 1.5rem; background-color: #fafaf9; border-radius: 1.25rem; border: 2px solid #f5f5f4; outline: none; transition: all 0.4s ease; font-weight: 700; color: #1c1917; font-size: 1rem; }
        .input-c:focus { border-color: #d6d3cd; background-color: white; box-shadow: 0 15px 30px -10px rgba(0,0,0,0.05); }
        .input-c::placeholder { color: #d6d3cd; font-weight: 400; }
       `}</style>
    </section>
  );
};
