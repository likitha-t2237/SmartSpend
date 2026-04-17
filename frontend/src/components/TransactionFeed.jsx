import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const LiveTransactions = ({ transactions = [] }) => {
    return (
        <div className="glass-panel p-6 flex flex-col h-full bg-white/[0.01]">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-[15px] font-bold text-white tracking-tight">Live Transactions</h3>
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-400">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    Real-time
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
                <AnimatePresence>
                    {transactions.length === 0 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-12 text-slate-500">
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                            <p className="text-sm">Listening for transactions...</p>
                        </motion.div>
                    )}

                    {transactions.map((txn, i) => (
                        <motion.div
                            key={txn.transaction_id || i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex flex-col gap-2 pb-4 border-b border-white/[0.04] last:border-0 last:pb-0"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-semibold text-slate-200 text-[14px]">{txn.merchant_name}</h4>
                                        <span className={`px-1.5 py-[1px] text-[10px] uppercase font-bold rounded-md ${
                                            txn.risk_level === 'high' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                                            txn.risk_level === 'medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                            'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                        }`}>
                                            {txn.risk_level || 'low'}
                                        </span>
                                    </div>
                                    <div className="text-[12px] text-slate-500 flex items-center gap-1.5">
                                        <span className="capitalize">{txn.category}</span>
                                        <span>•</span>
                                        <span>{(txn.confidence * 100 || 95.0).toFixed(1)}% conf</span>
                                    </div>
                                </div>
                                <div className="text-[14px] font-bold text-white">
                                    -₹{(txn.amount || 0).toLocaleString()}
                                </div>
                            </div>
                            
                            {/* Nudge / Redirect Alert mock if data provides it */}
                            {txn.risk_level === 'high' && (
                                <div className="mt-1 bg-violet-500/10 border border-violet-500/20 rounded-lg p-2.5 flex items-start gap-2">
                                    <svg className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    <p className="text-[11px] text-violet-300">
                                        Risk score spike! Redirecting <span className="font-bold">₹{Math.round((txn.amount || 0) * 0.2)}</span> to protect your goals.
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};
