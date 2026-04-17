import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

export const WalletPage = () => {
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
                    wallet: { total_invested: 56463, this_week: 12400, this_month: 34200, weekly_cap: 2000, redirect_percent: 20 },
                    bank_balance: 139151.28,
                    transfers: [
                        { transaction_id: 'tr1', amount: 513, from: 'bank', to: 'wallet', timestamp: new Date().toISOString() },
                        { transaction_id: 'tr2', amount: 860, from: 'bank', to: 'wallet', timestamp: new Date(Date.now() - 3600000).toISOString() },
                        { transaction_id: 'tr3', amount: 200, from: 'bank', to: 'wallet', timestamp: new Date(Date.now() - 7200000).toISOString() },
                    ],
                    investment_logs: []
                });
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    if (loading) return <div className="flex items-center justify-center h-full text-slate-500">Loading wallet...</div>;
    if (!data) return null;

    const w = data.wallet;

    return (
        <div className="flex flex-col gap-5 w-full pb-10">
            <div className="mb-2 mt-2">
                <h1 className="text-[22px] font-bold text-white tracking-tight mb-1">Wallet</h1>
                <p className="text-slate-400 text-[13px]">Your investment wallet powered by impulse redirects</p>
            </div>

            {/* Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="glass-panel p-6 bg-white/[0.01] relative overflow-hidden">
                    <div className="absolute -right-8 -top-8 w-24 h-24 bg-blue-500/20 blur-[40px] rounded-full"></div>
                    <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-3">Total Wallet Balance</div>
                    <div className="text-[36px] font-bold text-white leading-none">₹{w.total_invested.toLocaleString('en-IN')}</div>
                    <div className="text-emerald-400 text-[12px] font-bold mt-2">↗ Auto-growing from nudge redirects</div>
                </div>
                <div className="glass-panel p-6 bg-white/[0.01]">
                    <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-3">This Week</div>
                    <div className="text-2xl font-bold text-white">₹{w.this_week.toLocaleString('en-IN')}</div>
                    <div className="mt-3 w-full bg-white/5 rounded-full h-1.5">
                        <div className="bg-violet-500 h-full rounded-full" style={{ width: `${Math.min((w.this_week / w.weekly_cap) * 100, 100)}%` }}></div>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">Cap: ₹{w.weekly_cap.toLocaleString()}/week</div>
                </div>
                <div className="glass-panel p-6 bg-white/[0.01]">
                    <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-3">This Month</div>
                    <div className="text-2xl font-bold text-white">₹{w.this_month.toLocaleString('en-IN')}</div>
                    <div className="text-[10px] text-slate-500 mt-2">Redirect Rate: {w.redirect_percent}% of flagged spending</div>
                </div>
            </div>

            {/* Bank Balance */}
            <div className="glass-panel p-6 bg-white/[0.01]">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-2">Linked Bank Account</div>
                        <div className="text-2xl font-bold text-white">₹{data.bank_balance.toLocaleString('en-IN')}</div>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center">
                        <svg className="w-6 h-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                    </div>
                </div>
            </div>

            {/* Transfer History */}
            <div className="glass-panel p-6 bg-white/[0.01]">
                <h3 className="text-[15px] font-bold text-white mb-4">Transfer History</h3>
                <div className="space-y-3">
                    {data.transfers.length === 0 ? (
                        <p className="text-slate-500 text-[13px] text-center py-6">No transfers yet. Transactions with nudges will auto-redirect funds here.</p>
                    ) : data.transfers.map((t, i) => (
                        <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                            className="flex items-center justify-between p-3.5 rounded-xl border border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                                </div>
                                <div>
                                    <div className="text-[13px] font-medium text-slate-200 capitalize">{t.from} → {t.to}</div>
                                    <div className="text-[11px] text-slate-500">{new Date(t.timestamp).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</div>
                                </div>
                            </div>
                            <span className="text-[14px] font-bold text-emerald-400">+₹{t.amount.toLocaleString()}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};
