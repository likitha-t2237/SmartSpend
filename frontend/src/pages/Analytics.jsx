import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ExpenseChart } from '../components/ExpenseChart';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

export const Analytics = () => {
    const [monthlyData, setMonthlyData] = useState([]);
    const [riskData, setRiskData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const userId = localStorage.getItem('currentUser') || 'usr_priya';
            try {
                const [monthlyRes, riskRes] = await Promise.all([
                    axios.get(`http://localhost:5000/api/analytics/monthly/${userId}`),
                    axios.get(`http://localhost:5000/api/analytics/risk-distribution/${userId}`)
                ]);
                setMonthlyData(monthlyRes.data);
                setRiskData(riskRes.data);
            } catch (err) {
                console.error("Failed to fetch analytics", err);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="flex flex-col gap-8 w-full pb-10">
            <div className="mb-2 mt-2">
                <h1 className="text-[22px] font-bold text-white tracking-tight mb-1">Analytics Engine</h1>
                <p className="text-slate-400 text-[13px] max-w-xl leading-relaxed">Deep dive into user spending patterns, classification accuracy, and ruleset performance metrics.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 h-[400px]">
                    <ExpenseChart data={monthlyData} />
                </div>
                
                <div className="glass-panel p-6 bg-white/[0.01] flex flex-col items-center">
                    <h3 className="text-[14px] font-semibold text-slate-300 mb-6 self-start">AI Risk Distribution</h3>
                    <div className="w-full h-[280px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={riskData}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {riskData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <RechartsTooltip 
                                    contentStyle={{ background: '#15172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Legend verticalAlign="bottom" height={36}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

