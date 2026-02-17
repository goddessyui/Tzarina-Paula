
import React, { useState, useEffect } from 'react';
import { useConfig } from '../contexts/ConfigContext';
import { Facebook, Instagram, Linkedin, Youtube, ShieldCheck } from 'lucide-react';

const TiktokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1Z"/>
  </svg>
);

const ArtStationIcon = ({ className }: { className?: string }) => (
   <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
     <path d="M10.76 16.89 7.04 19.1 0 5.86h5.2zM12.9 6.78l3.96-2.14L24 17.65h-5.26zM13.63 8.3 10 14.5l-2.07-3.6 2.06-3.62z"/>
   </svg>
);

const DeviantArtIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M18.82 2.62h-3.32l-1.92 3.63h-3.4V9.6h1.9l-2.6 4.93H4.18v3.65h3.33l1.92-3.65h3.4v-3.35h-1.9l2.6-4.93h5.32V2.62h-.03Z"/>
    </svg>
);

const ShutterstockIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M22 6h-6V4h8v8h-2V6zM2 18h6v2H0v-8h2v6zM22 18v-6h2v8h-8v-2h6zM2 6v6H0V4h8v2H2zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/>
  </svg>
);

export const Footer: React.FC<{ onNavigate?: (page: string) => void }> = ({ onNavigate }) => {
    const { config, gameState } = useConfig();
    const [logoError, setLogoError] = useState(false);

    useEffect(() => {
        setLogoError(false);
    }, [config.general.logoUrl]);
    
    const getSocialIcon = (name: string) => {
        switch(name.toLowerCase()) {
          case 'facebook': return Facebook;
          case 'instagram': return Instagram;
          case 'linkedin': return Linkedin;
          case 'youtube': return Youtube;
          case 'tiktok': return TiktokIcon;
          case 'deviantart': return DeviantArtIcon;
          case 'artstation': return ArtStationIcon;
          case 'shutterstock': return ShutterstockIcon;
          default: return null;
        }
    };

    const showImageLogo = config.general.logoUrl && !logoError;

    return (
        <footer className="bg-paper pt-24 pb-28 md:pb-12 border-t border-stone-300 relative overflow-hidden mt-auto">
            <div className="container-max relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start gap-16 mb-24">
                    <div className="max-w-md space-y-10">
                        <div className="flex flex-col items-start">
                            {showImageLogo ? (
                              <div className={`logo-scan mb-8 transition-all duration-500 ${gameState.mode === 'logic' ? 'grayscale contrast-125' : 'grayscale-0'}`}>
                                <img 
                                  src={config.general.logoUrl} 
                                  alt={config.general.appName} 
                                  className="h-16 md:h-20 w-auto object-contain hover:scale-105 transition-transform" 
                                  onError={() => setLogoError(true)}
                                />
                              </div>
                            ) : (
                              <h4 className="font-heading text-5xl text-stone-800 mb-6 tracking-tight">{config.general.appName}</h4>
                            )}
                            <p className="font-body text-stone-600 text-lg leading-relaxed font-light">
                                {config.contact.footerText}
                            </p>
                        </div>
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400 mb-3 block">Direct Protocol</span>
                            <a href={`mailto:${config.contact.email}`} className="text-2xl md:text-3xl font-heading text-stone-800 hover:text-accent transition-colors border-b-2 border-stone-300 hover:border-accent pb-1 inline-block break-all">
                                {config.contact.email}
                            </a>
                        </div>
                    </div>

                    <div className="flex flex-col md:items-end gap-10 w-full md:w-auto">
                        <div className="flex flex-col md:items-end gap-6">
                            <button 
                                onClick={() => onNavigate?.('feedback')}
                                className="flex items-center gap-3 px-8 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-stone-400 hover:text-stone-900 transition-all text-[10px] font-black uppercase tracking-widest group no-logic"
                            >
                                <ShieldCheck size={16} className="text-stone-200 group-hover:text-accent" />
                                Client Feedback Portal
                            </button>
                            {config.contact.signatureUrl && (
                                <div className="relative transform scale-x-[-1]">
                                    <img 
                                        src={config.contact.signatureUrl} 
                                        alt="Signature" 
                                        className="w-32 md:w-48 opacity-90 transform hover:scale-105 hover:-rotate-2 transition-transform duration-500 origin-center select-none"
                                    />
                                </div>
                            )}
                        </div>
                        <div className="flex flex-wrap justify-center md:justify-end gap-4">
                            {Object.entries(config.contact.socials).map(([key, url]) => {
                                if (!url) return null;
                                const Icon = getSocialIcon(key);
                                if (!Icon) return null;
                                return (
                                <a 
                                    key={key} 
                                    href={url} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="w-12 h-12 flex items-center justify-center bg-white rounded-xl text-stone-600 border border-stone-200 hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-all shadow-sm hover:-translate-y-1"
                                    aria-label={key}
                                >
                                    <Icon className="w-5 h-5" />
                                </a>
                                );
                            })}
                        </div>
                    </div>
                </div>
                <div className="pt-8 border-t border-stone-300 flex flex-col md:flex-row justify-between items-center gap-4 text-stone-400 text-[10px] font-bold uppercase tracking-[0.2em]">
                    <p>&copy; {new Date().getFullYear()} {config.general.appName}. All rights reserved.</p>
                    <div className="flex items-center gap-6 text-center md:text-right">
                         {config.contact.location && <span className="hidden md:inline">{config.contact.location}</span>}
                         <span className="w-1 h-1 bg-stone-300 rounded-full"></span>
                         <span>v3.1 Stable_Build</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};
