import React from 'react';

export const AiInsights = ({ data }) => {
    if (!data) return (
        <div className="glass-panel p-6 bg-[#0a0d16] border-white/5 flex items-center justify-center h-full">
            <p className="text-slate-500 text-xs text-center animate-pulse">Analyzing spending patterns...</p>
        </div>
    );

    return (
        <div className="glass-panel p-6 bg-[#0a0d16] border-white/5 relative overflow-hidden flex flex-col h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/10 blur-[50px] rounded-full pointer-events-none"></div>
            
            <div className="flex justify-between items-center mb-6 relative z-10">
                <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-fuchsia-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <h3 className="font-bold text-white text-[15px]">AI Insights</h3>
                </div>
                <div className="bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider">LIVE</div>
            </div>

            <div className="flex-1 flex flex-col gap-6 relative z-10 space-y-2">
                <div>
                    <h4 className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1">Spending Personality</h4>
                    <div className="text-fuchsia-400 font-semibold text-[15px]">{data.personality}</div>
                    <p className="text-[11px] text-slate-400 mt-0.5">KMeans cluster analysis on behavioral features</p>
                </div>

                <div>
                    <h4 className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1.5">Risk Score</h4>
                    <div className="flex items-baseline gap-1 mb-2">
                        <span className="text-[28px] font-bold text-rose-500 leading-none">{data.risk_score_avg.toFixed(1)}</span>
                        <span className="text-slate-500 text-sm font-medium">/10</span>
                    </div>
                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-amber-500 to-rose-500 h-full rounded-full" style={{ width: `${Math.min(100, data.risk_score_avg * 10)}%` }}></div>
                    </div>
                </div>

                <div>
                    <h4 className="text-[10px] font-semibold text-amber-500/80 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        Overspend Prediction
                    </h4>
                    <div className="text-amber-400 font-bold text-[24px] leading-none mb-1">{data.overspend_probability}%</div>
                    <p className="text-[11px] text-slate-400">Probability of exceeding budget today</p>
                </div>

                <div className="pt-2">
                    <h4 className="text-[10px] font-semibold text-emerald-500 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                         <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                        Savings Rate
                    </h4>
                    <div className="text-emerald-400 font-bold text-[24px] leading-none mb-2">{data.savings_rate}%</div>
                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${data.savings_rate}%` }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};
