import React, { useState } from 'react';
import { Loader2, CheckCircle, AlertCircle, Send, MessageCircle } from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';
import { AvailabilityGauge } from './AvailabilityGauge';

export const ContactSection: React.FC = () => {
  const { config } = useConfig();
  
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error' | 'missing_config'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config.contact.formspreeId) {
        setStatus('missing_config');
        return;
    }
    
    setStatus('submitting');
    try {
      const response = await fetch(`https://formspree.io/f/${config.contact.formspreeId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
            name: formData.name, email: formData.email,
            message: formData.message, _subject: formData.subject,
        })
      });
      if (response.ok) setStatus('success');
      else setStatus('error');
    } catch { setStatus('error'); }
  };

  return (
    <section id="contact-section" className="py-24 md:py-36 max-w-7xl mx-auto px-6 flex flex-col items-center">
       
       <div className="text-center max-w-3xl mb-16 md:mb-24 space-y-6">
            <span className="text-accent text-[10px] font-black uppercase tracking-[0.4em] block">Final Protocol</span>
            <h2 className="text-section-title font-heading text-stone-950">
                Let's build<br/><span className="italic text-stone-400">something iconic.</span>
            </h2>
       </div>

       <div className="w-full bg-white rounded-[2rem] md:rounded-[4rem] border border-stone-200 shadow-2xl overflow-hidden max-w-6xl relative">
            <div className="absolute top-0 left-0 w-full h-3 bg-stone-950"></div>
            
            {status === 'success' ? (
                <div className="p-16 md:p-24 text-center animate-in fade-in zoom-in-95">
                    <CheckCircle size={80} className="mx-auto mb-8 text-green-500"/>
                    <h2 className="text-4xl md:text-5xl font-heading mb-6 text-stone-900">Message Transmitted.</h2>
                    <p className="text-stone-500 mb-10 text-lg md:text-xl font-light">I'll review your brief and get back to you within 48 hours.</p>
                    <button 
                        onClick={() => { setStatus('idle'); setFormData({ name: '', email: '', subject: '', message: '' }); }} 
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

                            <div className="space-y-4">
                                <h3 className="font-black uppercase tracking-widest text-[10px] text-stone-300">Social_Net</h3>
                                <div className="flex flex-wrap gap-3">
                                    {Object.entries(config.contact.socials).map(([key, url]) => {
                                        if(!url) return null;
                                        return (
                                            <a key={key} href={url} target="_blank" rel="noreferrer" className="px-4 py-2 bg-white rounded-xl border border-stone-200 text-stone-500 hover:text-stone-950 hover:border-stone-950 capitalize text-[10px] font-black tracking-widest transition-all">
                                                {key}
                                            </a>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-3 p-10 md:p-16">
                        <form onSubmit={handleSubmit} className="space-y-8">
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
                                <input className="input-c" name="subject" placeholder="What are we creating?" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} required />
                            </div>
                            <div className="space-y-3">
                                <label className="block text-[10px] uppercase tracking-widest font-black text-stone-400">Project Brief</label>
                                <textarea rows={5} className="input-c resize-none" name="message" placeholder="Tell me about your goals, timeline, and vision. I'll act as the bridge to bring it to life." value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} required></textarea>
                            </div>
                            
                            {status === 'missing_config' && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2"><AlertCircle size={14} /><span>Form ID Configuration Missing</span></div>}
                            {status === 'error' && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2"><AlertCircle size={14} /><span>Network Interrupt Detected</span></div>}

                            <button type="submit" disabled={status === 'submitting'} className="w-full bg-stone-950 text-white py-6 rounded-2xl font-black uppercase tracking-[0.4em] text-xs hover:bg-accent hover:text-stone-950 transition-all disabled:opacity-50 flex items-center justify-center gap-4 shadow-xl active:scale-95 group">
                                {status === 'submitting' ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"/>}
                                {status === 'submitting' ? 'Transmitting...' : 'Send Signal'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
       </div>
       <style>{`
        .input-c { width: 100%; padding: 1.25rem 1.5rem; background-color: #fafaf9; border-radius: 1.25rem; border: 2px solid #f5f5f4; outline: none; transition: all 0.4s ease; font-weight: 700; color: #1c1917; font-size: 1rem; }
        .input-c:focus { border-color: #d6d3cd; background-color: white; box-shadow: 0 15px 30px -10px rgba(0,0,0,0.05); }
        .input-c::placeholder { color: #d6d3cd; font-weight: 400; }
       `}</style>
    </section>
  );
};