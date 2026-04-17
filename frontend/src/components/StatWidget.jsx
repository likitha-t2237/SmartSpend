import React from 'react';

export const StatWidget = ({ title, value, prefix = '₹', trend = null, isPositive = true, icon, badgeText = null, iconBgClass = 'bg-violet-600' }) => {
    // Determine the text color for the badge
    const badgeCustomClass = badgeText === 'Exceeded' || !isPositive ? 'text-rose-400 bg-rose-400/10 border-rose-400/20' : 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';

    return (
        <div className="glass-panel relative overflow-hidden group p-5">
            <div className="absolute -right-6 -top-6 opacity-30 group-hover:opacity-100 transition-opacity duration-700">
                <div className={`w-32 h-32 rounded-full blur-[40px] opacity-20 ${iconBgClass}`}></div>
            </div>
            
            <div className="flex justify-between items-start mb-3 relative z-10">
                <h3 className="text-slate-400 font-medium text-sm md:text-[15px]">{title}</h3>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white shadow-lg ${iconBgClass}`}>
                    {icon || (
                        <svg className="w-5 h-5 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )}
                </div>
            </div>
            
            <div className="relative z-10 flex flex-col gap-2 mt-1">
                <h2 className="text-[28px] md:text-3xl font-bold tracking-tight text-white leading-none">
                    {prefix}{typeof value === 'number' ? value.toLocaleString('en-IN', { maximumFractionDigits: 2 }) : value}
                </h2>
                
                <div className="flex items-center gap-2 mt-1">
                    {badgeText ? (
                        <div className={`text-xs font-semibold px-2.5 py-[3px] rounded-md border ${badgeCustomClass}`}>
                            {badgeText}
                        </div>
                    ) : trend !== null ? (
                        <div className={`flex items-center text-[12px] font-semibold px-2 py-[2px] rounded-md border ${badgeCustomClass}`}>
                            {isPositive ? '+' : '-'}{Math.abs(trend)}%
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
};
