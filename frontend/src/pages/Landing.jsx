import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#0B0D17] relative overflow-hidden flex flex-col items-center justify-center">
            {/* Background Effects */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-violet-600/30 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-magenta-600/20 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-teal-500/10 rounded-[100%] blur-[120px] pointer-events-none"></div>

            {/* Content */}
            <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-violet-300 text-xs font-semibold tracking-wide mb-8">
                        <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse"></span>
                        SPENDSMART OS V2.0
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8 leading-tight">
                        Intelligent Nudging <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-teal-300">
                            For Growth Teams.
                        </span>
                    </h1>

                    <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
                        Transform raw spending data into real-time, behavioral nudges. 
                        Optimize retention, drive auto-investments, and perfectly align limits.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/dashboard')}
                            className="w-full sm:w-auto px-8 py-4 bg-white text-[#0B0D17] font-bold rounded-xl shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] transition-all flex items-center justify-center gap-2"
                        >
                            Enter Dashboard 
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </motion.button>
                        
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full sm:w-auto px-8 py-4 bg-white/5 text-white font-bold rounded-xl border border-white/10 hover:bg-white/10 transition-all"
                        >
                            View Analytics
                        </motion.button>
                    </div>
                </motion.div>
                
                {/* Visual Mock App UI */}
                <motion.div 
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="mt-16 w-full max-w-4xl mx-auto h-[300px] border border-white/10 rounded-t-3xl bg-[#0B0D17]/50 backdrop-blur-xl relative overflow-hidden shadow-2xl shadow-violet-900/20"
                >
                    <div className="absolute top-0 left-0 w-full h-12 border-b border-white/10 flex items-center px-6 gap-2 bg-white/5">
                        <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                        <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
