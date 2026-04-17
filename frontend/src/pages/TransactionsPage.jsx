import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const riskColors = {
    high: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
};

const categoryEmoji = {
    food: '🍕', shopping: '🛍️', transport: '🚗', subscriptions: '📺',
    groceries: '🛒', entertainment: '🎮', utilities: '💡', health: '💊',
};

export const TransactionsPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const fetchTxns = async () => {
            const userId = localStorage.getItem('currentUser') || 'usr_priya';
            try {
                const res = await axios.get(`http://localhost:5000/api/transactions/${userId}`);
                setTransactions(res.data.transactions || []);
            } catch {
                // Demo fallback data
                setTransactions([
                    { transaction_id: 't1', merchant_name: 'Starbucks', amount: 330.68, category: 'food', risk_level: 'medium', impulse_score: 6.2, category_confidence: 0.976, timestamp: new Date().toISOString(), nudge_fired: false },
                    { transaction_id: 't2', merchant_name: 'Myntra', amount: 2566.93, category: 'shopping', risk_level: 'high', impulse_score: 8.9, category_confidence: 0.862, timestamp: new Date(Date.now() - 3600000).toISOString(), nudge_fired: true, invest_triggered: 513 },
                    { transaction_id: 't3', merchant_name: 'Netflix', amount: 508.86, category: 'subscriptions', risk_level: 'low', impulse_score: 2.1, category_confidence: 0.974, timestamp: new Date(Date.now() - 7200000).toISOString(), nudge_fired: false },
                    { transaction_id: 't4', merchant_name: 'Spotify', amount: 1663.69, category: 'subscriptions', risk_level: 'low', impulse_score: 1.8, category_confidence: 0.997, timestamp: new Date(Date.now() - 10800000).toISOString(), nudge_fired: false },
                    { transaction_id: 't5', merchant_name: 'Uber', amount: 245.00, category: 'transport', risk_level: 'low', impulse_score: 3.2, category_confidence: 0.95, timestamp: new Date(Date.now() - 14400000).toISOString(), nudge_fired: false },
                    { transaction_id: 't6', merchant_name: 'Amazon', amount: 4299.00, category: 'shopping', risk_level: 'high', impulse_score: 9.1, category_confidence: 0.88, timestamp: new Date(Date.now() - 18000000).toISOString(), nudge_fired: true, invest_triggered: 860 },
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchTxns();
    }, []);

    const filtered = filter === 'all' ? transactions : transactions.filter(t => t.risk_level === filter);

    return (
        <div className="flex flex-col gap-5 w-full pb-10">
            <div className="mb-2 mt-2">
                <h1 className="text-[22px] font-bold text-white tracking-tight mb-1">Transactions</h1>
                <p className="text-slate-400 text-[13px]">Complete history of all spending activity</p>
            </div>

            {/* Filter Chips */}
            <div className="flex items-center gap-2 flex-wrap">
                {['all', 'high', 'medium', 'low'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-xl text-[12px] font-semibold border capitalize transition-all duration-200 ${
                            filter === f
                                ? 'bg-violet-500/20 text-violet-300 border-violet-500/30'
                                : 'bg-white/[0.02] text-slate-400 border-white/5 hover:bg-white/[0.04]'
                        }`}
                    >
                        {f === 'all' ? 'All Transactions' : `${f} Risk`}
                    </button>
                ))}
                <div className="ml-auto text-[12px] text-slate-500">{filtered.length} transactions</div>
            </div>

            {/* Table */}
            <div className="glass-panel overflow-hidden bg-white/[0.01]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="px-6 py-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Merchant</th>
                                <th className="px-6 py-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Risk</th>
                                <th className="px-6 py-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Impulse</th>
                                <th className="px-6 py-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Confidence</th>
                                <th className="px-6 py-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Nudge</th>
                                <th className="px-6 py-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={8} className="text-center py-12 text-slate-500">Loading transactions...</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={8} className="text-center py-12 text-slate-500">No transactions found</td></tr>
                            ) : filtered.map((txn, i) => (
                                <motion.tr
                                    key={txn.transaction_id || i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.03 }}
                                    className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-lg">{categoryEmoji[txn.category] || '💳'}</span>
                                            <span className="text-[13px] font-medium text-slate-200">{txn.merchant_name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-[11px] capitalize bg-white/5 px-2.5 py-1 rounded-md text-slate-300 border border-white/5">{txn.category}</span>
                                    </td>
                                    <td className="px-6 py-4 text-[14px] font-bold text-white">-₹{(txn.amount || 0).toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded-md border ${riskColors[txn.risk_level] || riskColors.low}`}>
                                            {txn.risk_level || 'low'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-[13px] text-slate-300">{(txn.impulse_score || 0).toFixed(1)}</td>
                                    <td className="px-6 py-4 text-[13px] text-slate-300">{((txn.category_confidence || 0) * 100).toFixed(1)}%</td>
                                    <td className="px-6 py-4">
                                        {txn.nudge_fired ? (
                                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                                                +₹{txn.invest_triggered || 0}
                                            </span>
                                        ) : (
                                            <span className="text-[11px] text-slate-600">—</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-[12px] text-slate-500">
                                        {new Date(txn.timestamp).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
