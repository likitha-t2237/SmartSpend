import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';

const COLORS = ['#F43F5E', '#3B82F6', '#10B981', '#EAB308', '#8B5CF6', '#D946EF', '#14B8A6', '#F97316'];

export const InsightsPage = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            const userId = localStorage.getItem('currentUser') || 'usr_priya';
            try {
                const res = await axios.get(`http://localhost:5000/api/insights/${userId}`);
                setData(res.data);
            } catch {
                setData({
                    personality: 'Midnight Impulse Buyer',
                    risk_score_avg: 9.9,
                    total_transactions: 47,
                    total_spent: 180468.72,
                    high_risk_count: 12,
                    nudge_hit_rate: '34.0',
                    total_invested: 56463,
                    savings_rate: '23.4',
                    overspend_probability: 72,
                    category_breakdown: [
                        { name: 'Food', value: 8400 }, { name: 'Shopping', value: 11200 },
                        { name: 'Transport', value: 3200 }, { name: 'Subscriptions', value: 2800 },
                        { name: 'Groceries', value: 4600 }, { name: 'Entertainment', value: 4000 }
                    ],
                    hourly_pattern: [0,0,0,0,0,0,200,500,1200,1800,2200,3100,4500,3800,2900,2100,3200,4100,5200,6800,7200,5500,3200,800],
                    recent_high_risk: [
                        { merchant: 'Myntra', amount: 2566, category: 'shopping', score: 8.9 },
                        { merchant: 'Amazon', amount: 4299, category: 'shopping', score: 9.1 },
                    ]
                });
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    if (loading) return <div className="flex items-center justify-center h-full text-slate-500">Loading insights...</div>;
    if (!data) return null;

    const hourlyData = (data.hourly_pattern || []).map((v, i) => ({ hour: `${i}:00`, amount: v }));

    return (
        <div className="flex flex-col gap-5 w-full pb-10">
            <div className="mb-2 mt-2">
                <h1 className="text-[22px] font-bold text-white tracking-tight mb-1">AI Insights</h1>
                <p className="text-slate-400 text-[13px]">ML-powered behavioral analysis of your spending</p>
            </div>

            {/* Top Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Spending Personality', value: data.personality, color: 'text-fuchsia-400' },
                    { label: 'Risk Score', value: `${data.risk_score_avg}/10`, color: 'text-rose-400' },
                    { label: 'Overspend Probability', value: `${data.overspend_probability}%`, color: 'text-amber-400' },
                    { label: 'Savings Rate', value: `${data.savings_rate}%`, color: 'text-emerald-400' },
                ].map((s, i) => (
                    <div key={i} className="glass-panel p-5 bg-white/[0.01]">
                        <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-2">{s.label}</div>
                        <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
                    </div>
                ))}
            </div>

            {/* Mid Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Category Breakdown */}
                <div className="glass-panel p-6 bg-white/[0.01]">
                    <h3 className="text-[15px] font-bold text-white mb-4">Category Breakdown</h3>
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Tooltip contentStyle={{ background: '#15172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 13 }} />
                                <Pie data={data.category_breakdown} innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value" stroke="none">
                                    {data.category_breakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-[11px]">
                        {data.category_breakdown.map((c, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }}></span><span className="text-slate-400">{c.name}</span></div>
                                <span className="text-white font-medium">₹{(c.value/1000).toFixed(1)}k</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Hourly Spending Pattern */}
                <div className="glass-panel p-6 bg-white/[0.01]">
                    <h3 className="text-[15px] font-bold text-white mb-4">Hourly Spending Heatmap</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={hourlyData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                                <XAxis dataKey="hour" stroke="#475569" tickLine={false} axisLine={false} className="text-[9px]" interval={3} />
                                <YAxis stroke="#475569" tickLine={false} axisLine={false} className="text-[10px]" tickFormatter={v => `₹${v/1000}k`} />
                                <Tooltip contentStyle={{ background: '#15172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 13 }} formatter={v => [`₹${v}`, 'Amount']} />
                                <Bar dataKey="amount" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="glass-panel p-6 bg-white/[0.01]">
                    <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-3">Total Transactions</div>
                    <div className="text-3xl font-bold text-white mb-1">{data.total_transactions}</div>
                    <p className="text-[11px] text-slate-500">Analyzed by ML pipeline</p>
                </div>
                <div className="glass-panel p-6 bg-white/[0.01]">
                    <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-3">Nudge Hit Rate</div>
                    <div className="text-3xl font-bold text-violet-400 mb-1">{data.nudge_hit_rate}%</div>
                    <p className="text-[11px] text-slate-500">Of spending triggered smart nudges</p>
                </div>
                <div className="glass-panel p-6 bg-white/[0.01]">
                    <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-3">High Risk Flags</div>
                    <div className="text-3xl font-bold text-rose-400 mb-1">{data.high_risk_count}</div>
                    <p className="text-[11px] text-slate-500">Transactions flagged by ML scoring</p>
                </div>
            </div>

            {/* Recent High Risk */}
            {data.recent_high_risk?.length > 0 && (
                <div className="glass-panel p-6 bg-white/[0.01]">
                    <h3 className="text-[15px] font-bold text-white mb-4">Recent High-Risk Transactions</h3>
                    <div className="space-y-3">
                        {data.recent_high_risk.map((t, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-rose-500/5 border border-rose-500/10">
                                <div>
                                    <span className="text-[13px] font-medium text-slate-200">{t.merchant}</span>
                                    <span className="ml-2 text-[11px] text-slate-500 capitalize">{t.category}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[11px] text-rose-400 font-medium">Score: {t.score}</span>
                                    <span className="text-[14px] font-bold text-white">-₹{t.amount.toLocaleString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
