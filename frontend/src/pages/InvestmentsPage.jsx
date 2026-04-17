import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

export const InvestmentsPage = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            const userId = localStorage.getItem('currentUser') || 'usr_priya';
            try {
                const res = await axios.get(`http://localhost:5000/api/wallet/${userId}`);
                setData(res.data);
            } catch {
                setData({
                    wallet: { total_invested: 56463, this_week: 12400, this_month: 34200 },
                    investment_logs: [
                        { log_id: 'l1', amount: 513, source_category: 'shopping', reason: 'High impulse score redirect', risk_multiplier: 1.5, timestamp: new Date().toISOString() },
                        { log_id: 'l2', amount: 860, source_category: 'food', reason: 'Budget exceeded auto-invest', risk_multiplier: 2.0, timestamp: new Date(Date.now() - 3600000).toISOString() },
                        { log_id: 'l3', amount: 200, source_category: 'entertainment', reason: 'Rule-based redirect', risk_multiplier: 1.0, timestamp: new Date(Date.now() - 7200000).toISOString() },
                    ]
                });
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    if (loading) return <div className="flex items-center justify-center h-full text-slate-500">Loading investments...</div>;
    if (!data) return null;

    const w = data.wallet;
    const logs = data.investment_logs || [];

    return (
        <div className="flex flex-col gap-5 w-full pb-10">
            <div className="mb-2 mt-2">
                <h1 className="text-[22px] font-bold text-white tracking-tight mb-1">Investments</h1>
                <p className="text-slate-400 text-[13px]">Auto-invested savings from smart nudge redirects</p>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="glass-panel p-6 bg-white/[0.01] relative overflow-hidden">
                    <div className="absolute -right-8 -top-8 w-28 h-28 bg-emerald-500/15 blur-[40px] rounded-full"></div>
                    <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-3">Total Invested</div>
                    <div className="text-[32px] font-bold text-emerald-400 leading-none">₹{w.total_invested.toLocaleString('en-IN')}</div>
                </div>
                <div className="glass-panel p-6 bg-white/[0.01]">
                    <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-3">This Week</div>
                    <div className="text-2xl font-bold text-white">₹{w.this_week.toLocaleString('en-IN')}</div>
                </div>
                <div className="glass-panel p-6 bg-white/[0.01]">
                    <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-3">This Month</div>
                    <div className="text-2xl font-bold text-white">₹{w.this_month.toLocaleString('en-IN')}</div>
                </div>
            </div>

            {/* Investment Log */}
            <div className="glass-panel p-6 bg-white/[0.01]">
                <h3 className="text-[15px] font-bold text-white mb-5">Investment Activity Log</h3>
                <div className="space-y-3">
                    {logs.length === 0 ? (
                        <p className="text-slate-500 text-center py-8 text-[13px]">No investment logs yet. They appear when nudges trigger auto-redirects.</p>
                    ) : logs.map((log, i) => (
                        <motion.div key={log.log_id || i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                            className="flex items-center justify-between p-4 rounded-xl border border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                                </div>
                                <div>
                                    <div className="text-[13px] font-medium text-slate-200">{log.reason || 'Auto-invest redirect'}</div>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-[11px] text-slate-500 capitalize">{log.source_category}</span>
                                        <span className="text-[10px] text-slate-600">•</span>
                                        <span className="text-[11px] text-slate-500">{log.risk_multiplier}x multiplier</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-[14px] font-bold text-emerald-400">+₹{log.amount.toLocaleString()}</div>
                                <div className="text-[10px] text-slate-500 mt-0.5">{new Date(log.timestamp).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};
