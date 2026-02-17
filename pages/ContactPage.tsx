
import React, { useState } from 'react';
import { Loader2, CheckCircle, AlertCircle, Send, Mail, MapPin } from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';

export const ContactPage: React.FC = () => {
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
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json' 
        },
        body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            message: formData.message,
            _subject: formData.subject,
        })
      });
      if (response.ok) setStatus('success');
      else setStatus('error');
    } catch { setStatus('error'); }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 max-w-5xl mx-auto px-6 md:px-16 flex flex-col items-center bg-paper">
       
       <div className="text-center max-w-2xl mb-16 space-y-6">
            <h1 className="font-heading text-6xl md:text-7xl text-stone-800 leading-tight">
                Let's build<br/><span className="italic text-stone-400">something iconic.</span>
            </h1>
            <p className="font-body text-stone-500 text-lg">
                Have a project in mind? I'm currently available for freelance work and collaborations.
            </p>
       </div>

       <div className="w-full bg-white rounded-[2.5rem] border border-stone-100 shadow-xl overflow-hidden max-w-4xl relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-stone-900"></div>
            
            {status === 'success' ? (
                <div className="p-20 text-center animate-in fade-in zoom-in-95">
                    <CheckCircle size={64} className="mx-auto mb-6 text-green-500"/>
                    <h2 className="text-4xl font-heading mb-4">Message Sent!</h2>
                    <p className="text-stone-500 mb-8 text-lg">Thank you for reaching out. I'll get back to you shortly.</p>
                    <button 
                        onClick={() => { setStatus('idle'); setFormData({ name: '', email: '', subject: '', message: '' }); }} 
                        className="text-stone-900 border-b-2 border-stone-900 pb-1 font-bold uppercase tracking-widest text-xs hover:text-accent hover:border-accent transition-colors"
                    >
                        Send Another Message
                    </button>
                </div>
            ) : (
                <div className="grid md:grid-cols-5">
                    <div className="md:col-span-2 bg-stone-50 p-10 flex flex-col justify-between border-r border-stone-100">
                        <div className="space-y-8">
                            <div>
                                <h3 className="font-bold uppercase tracking-widest text-xs text-stone-400 mb-2">Email</h3>
                                <a href={`mailto:${config.contact.email}`} className="text-stone-800 font-bold hover:text-accent break-words">{config.contact.email}</a>
                            </div>
                            <div>
                                <h3 className="font-bold uppercase tracking-widest text-xs text-stone-400 mb-2">Location</h3>
                                <p className="text-stone-800 font-medium">{config.contact.location}</p>
                            </div>
                            <div>
                                <h3 className="font-bold uppercase tracking-widest text-xs text-stone-400 mb-2">Connect</h3>
                                <div className="flex flex-wrap gap-3">
                                    {Object.entries(config.contact.socials).map(([key, url]) => {
                                        if(!url) return null;
                                        return (
                                            <a key={key} href={url} target="_blank" rel="noreferrer" className="text-stone-400 hover:text-stone-900 capitalize text-sm font-bold">
                                                {key}
                                            </a>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className="mt-10 pt-10 border-t border-stone-200/50">
                             <p className="text-stone-400 text-xs leading-relaxed">
                                Please allow 24-48 hours for a response. For urgent inquiries, please mark your subject line accordingly.
                             </p>
                        </div>
                    </div>

                    <div className="md:col-span-3 p-10 md:p-12">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs uppercase tracking-widest font-bold text-stone-400 mb-2 ml-1">Your Name</label>
                                    <input 
                                        className="input-field-contact" 
                                        name="name"
                                        placeholder="Jane Doe" 
                                        value={formData.name} 
                                        onChange={e => setFormData({...formData, name: e.target.value})} 
                                        required 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-widest font-bold text-stone-400 mb-2 ml-1">Email Address</label>
                                    <input 
                                        className="input-field-contact" 
                                        type="email" 
                                        name="email"
                                        placeholder="jane@example.com" 
                                        value={formData.email} 
                                        onChange={e => setFormData({...formData, email: e.target.value})} 
                                        required 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-widest font-bold text-stone-400 mb-2 ml-1">Subject / Project Type</label>
                                    <input 
                                        className="input-field-contact" 
                                        name="subject"
                                        placeholder="e.g. Motion Graphics for Brand" 
                                        value={formData.subject} 
                                        onChange={e => setFormData({...formData, subject: e.target.value})} 
                                        required 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-widest font-bold text-stone-400 mb-2 ml-1">Message</label>
                                    <textarea 
                                        rows={5} 
                                        className="input-field-contact resize-none" 
                                        name="message"
                                        placeholder="Tell me about your project, timeline, and goals..." 
                                        value={formData.message} 
                                        onChange={e => setFormData({...formData, message: e.target.value})} 
                                        required
                                    ></textarea>
                                </div>
                            </div>
                            
                            {status === 'missing_config' && (
                                <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm flex items-center gap-2">
                                    <AlertCircle size={16} />
                                    <span>Contact form is not configured. Please add a Formspree ID in the Admin Dashboard.</span>
                                </div>
                            )}

                            {status === 'error' && (
                                <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm flex items-center gap-2">
                                    <AlertCircle size={16} />
                                    <span>Something went wrong. Please try again later.</span>
                                </div>
                            )}

                            <button 
                                type="submit" 
                                disabled={status === 'submitting'}
                                className="w-full bg-stone-900 text-white py-5 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-accent hover:text-stone-900 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-1"
                            >
                                {status === 'submitting' && <Loader2 className="animate-spin" size={16} />}
                                {status === 'submitting' ? 'Sending...' : 'Send Message'}
                                {!status.includes('submitting') && <Send size={14} />}
                            </button>
                        </form>
                    </div>
                </div>
            )}
       </div>
       <style>{`
        .input-field-contact { width: 100%; padding: 1rem; background-color: #fafaf9; border-radius: 1rem; border: 1px solid #f5f5f4; outline: none; transition: all 0.2s; font-weight: 500; color: #292524; }
        .input-field-contact:focus { border-color: #e7e5e4; background-color: white; box-shadow: 0 4px 12px rgba(0,0,0,0.02); }
        .input-field-contact::placeholder { color: #d6d3cd; font-weight: 400; }
       `}</style>
    </div>
  );
};
