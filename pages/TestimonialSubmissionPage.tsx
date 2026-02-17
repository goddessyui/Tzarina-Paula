
import React, { useState } from 'react';
import { useConfig } from '../contexts/ConfigContext';
import { useToast } from '../contexts/ToastContext';
import { testimonialService } from '../services/supabaseService';
import { ShieldCheck, Send, Star, ArrowLeft, Loader2, Sparkles } from 'lucide-react';

export const TestimonialSubmissionPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
    const { config } = useConfig();
    const { showToast } = useToast();
    
    const [step, setStep] = useState<'voucher' | 'form' | 'success'>('voucher');
    const [voucherCode, setVoucherCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        client_name: '',
        client_role: '',
        content: '',
        rating: 5
    });

    const handleVerifyVoucher = (e: React.FormEvent) => {
        e.preventDefault();
        if (voucherCode.length < 5) {
            showToast("Please enter a valid code", "error");
            return;
        }
        setStep('form');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await testimonialService.submitWithVoucher(voucherCode.trim().toUpperCase(), formData);
            setStep('success');
            showToast("Review submitted for approval", "success");
        } catch (e: any) {
            showToast(e.message || "Failed to submit review", "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-paper flex items-center justify-center p-6 md:p-12 relative overflow-hidden">
            <div className="absolute top-12 left-12">
                <button onClick={() => onNavigate('home')} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors">
                    <ArrowLeft size={14}/> Back to Studio
                </button>
            </div>

            <div className="max-w-2xl w-full bg-white rounded-[3rem] p-12 md:p-16 border border-stone-100 shadow-2xl relative">
                <div className="absolute top-0 left-0 w-full h-2 bg-stone-900"></div>
                
                {step === 'voucher' && (
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="flex justify-center mb-8">
                            <div className="w-16 h-16 bg-stone-900 rounded-3xl flex items-center justify-center text-white shadow-xl">
                                <ShieldCheck size={32} />
                            </div>
                        </div>
                        <h2 className="font-heading text-5xl text-center mb-4 tracking-tighter">Secure Handover.</h2>
                        <p className="text-stone-500 text-center mb-12 font-light text-lg">
                            Please enter the secure project code provided by Tzarina to leave your feedback.
                        </p>
                        <form onSubmit={handleVerifyVoucher} className="space-y-6">
                            <input 
                                className="w-full bg-stone-50 border-2 border-stone-100 rounded-2xl py-5 px-8 text-center text-2xl font-mono font-bold tracking-widest focus:border-stone-900 transition-all outline-none"
                                placeholder="TZ-XXXXXX"
                                value={voucherCode}
                                onChange={e => setVoucherCode(e.target.value)}
                                required
                            />
                            <button className="w-full bg-stone-900 text-white py-6 rounded-2xl font-black uppercase tracking-[0.4em] text-[10px] hover:bg-accent hover:text-stone-900 transition-all shadow-xl active:scale-95">
                                Verify Access
                            </button>
                        </form>
                    </div>
                )}

                {step === 'form' && (
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                         <div className="flex items-center gap-4 mb-8">
                            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-stone-900">
                                <Star size={20} fill="currentColor" />
                            </div>
                            <h2 className="font-heading text-4xl tracking-tighter">Your Feedback.</h2>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-stone-300 ml-1">Your Name</label>
                                    <input className="input-f" placeholder="John Doe" value={formData.client_name} onChange={e => setFormData({...formData, client_name: e.target.value})} required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-stone-300 ml-1">Your Role / Company</label>
                                    <input className="input-f" placeholder="Creative Director" value={formData.client_role} onChange={e => setFormData({...formData, client_role: e.target.value})} required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-widest text-stone-300 ml-1">Your Quote</label>
                                <textarea className="input-f h-32 resize-none" placeholder="What was it like working together?" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} required />
                            </div>
                            <div className="flex items-center justify-between p-6 bg-stone-50 rounded-2xl">
                                <span className="text-[9px] font-black uppercase tracking-widest text-stone-400">Rating</span>
                                <div className="flex gap-2">
                                    {[1,2,3,4,5].map(s => (
                                        <button key={s} type="button" onClick={() => setFormData({...formData, rating: s})} className={`transition-colors ${formData.rating >= s ? 'text-accent' : 'text-stone-200'}`}>
                                            <Star size={24} fill={formData.rating >= s ? "currentColor" : "none"} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button disabled={isLoading} className="w-full bg-stone-900 text-white py-6 rounded-2xl font-black uppercase tracking-[0.4em] text-[10px] hover:bg-accent hover:text-stone-900 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-4 group">
                                {isLoading ? <Loader2 className="animate-spin" size={16}/> : <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                                {isLoading ? 'Transmitting...' : 'Submit to Archives'}
                            </button>
                        </form>
                    </div>
                )}

                {step === 'success' && (
                    <div className="text-center animate-in zoom-in-95 duration-700">
                        <div className="flex justify-center mb-8">
                             <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500">
                                <Sparkles size={40} />
                             </div>
                        </div>
                        <h2 className="font-heading text-5xl mb-4 tracking-tighter">Transmission Successful.</h2>
                        <p className="text-stone-500 mb-12 font-light text-lg">
                            Your feedback has been received and added to the processing queue. Thank you for being part of the journey.
                        </p>
                        <button onClick={() => onNavigate('home')} className="px-10 py-5 bg-stone-900 text-white rounded-full font-black uppercase tracking-[0.3em] text-[10px] hover:bg-accent hover:text-stone-900 transition-all">
                            Return to Portfolio
                        </button>
                    </div>
                )}
            </div>
            <style>{`
                .input-f { width: 100%; padding: 1.25rem 1.5rem; background: #fafaf9; border: 1px solid #f5f5f4; border-radius: 1.25rem; outline: none; transition: all 0.3s; font-weight: 700; color: #1c1917; }
                .input-f:focus { border-color: #d6d3cd; background: white; box-shadow: 0 8px 24px rgba(0,0,0,0.03); }
            `}</style>
        </div>
    );
};
