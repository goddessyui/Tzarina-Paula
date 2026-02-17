
import React from 'react';
import { useConfig } from '../contexts/ConfigContext';
import { ShieldCheck, ShieldAlert, Shield } from 'lucide-react';

export const AvailabilityGauge: React.FC<{ variant?: 'minimal' | 'full' }> = ({ variant = 'full' }) => {
    const { config } = useConfig();
    const { availabilityStatus, availableSlots, totalSlots } = config.general;

    const percentage = Math.round((availableSlots / totalSlots) * 100);
    
    const getStatusColor = () => {
        if (availabilityStatus === 'closed' || availableSlots === 0) return 'text-red-500 bg-red-50 border-red-100';
        if (availableSlots === 1) return 'text-orange-500 bg-orange-50 border-orange-100';
        return 'text-green-600 bg-green-50 border-green-100';
    };

    const getIcon = () => {
        if (availabilityStatus === 'closed' || availableSlots === 0) return <ShieldAlert size={14} />;
        if (availableSlots <= 2) return <Shield size={14} />;
        return <ShieldCheck size={14} />;
    };

    if (variant === 'minimal') {
        return (
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor()} transition-all duration-500`}>
                <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${availableSlots > 0 ? 'bg-current' : 'bg-red-400'}`}></div>
                <span className="text-[9px] font-black uppercase tracking-widest">
                    {availableSlots > 0 ? `${availableSlots} Opening${availableSlots > 1 ? 's' : ''}` : 'Fully Booked'}
                </span>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-xl shadow-stone-200/20 max-w-xs w-full">
            <div className="flex justify-between items-center mb-4">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-stone-300">Project Bandwidth</span>
                <div className={getStatusColor() + " p-1.5 rounded-lg"}>{getIcon()}</div>
            </div>
            
            <div className="space-y-3">
                <div className="flex justify-between items-end">
                    <h4 className="font-heading text-2xl text-stone-900 leading-none">
                        {availabilityStatus === 'closed' || availableSlots === 0 ? 'Capacity Reached' : `${availableSlots} Spot${availableSlots > 1 ? 's' : ''} Left`}
                    </h4>
                    <span className="font-mono text-[10px] text-stone-400">{percentage}%</span>
                </div>
                
                <div className="h-2 w-full bg-stone-50 rounded-full overflow-hidden border border-stone-100">
                    <div 
                        className={`h-full transition-all duration-1000 ease-out ${percentage < 30 ? 'bg-orange-400' : 'bg-stone-900'}`}
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                
                <p className="text-[8px] uppercase tracking-widest text-stone-400 leading-relaxed pt-1">
                    {availabilityStatus === 'closed' ? 'Next window opens in 2 weeks.' : 'Accepting new narratives for this week.'}
                </p>
            </div>
        </div>
    );
};
