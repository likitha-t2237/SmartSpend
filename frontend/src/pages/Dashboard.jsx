import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StatWidget } from '../components/StatWidget';
import { ExpenseChart } from '../components/ExpenseChart';
import { CategorySplit } from '../components/CategorySplit';
import { AiInsights } from '../components/AiInsights';
import { LiveTransactions } from '../components/TransactionFeed';
import { BudgetProgress as BudgetTracker } from '../components/BudgetProgress';
import { UpcomingBills } from '../components/UpcomingBills';
import { SaveUpGoals } from '../components/SaveUpGoals';
import { useSocket } from '../hooks/useSocket';
import axios from 'axios';

export const Dashboard = () => {
    const { transactions, budgets, nudge, investment } = useSocket();
    const [bankBalance, setBankBalance] = useState(139151.28);
    const [walletBalance, setWalletBalance] = useState(56463);
    const [spentMonth, setSpentMonth] = useState(180468.72);
    const [budgetRemaining, setBudgetRemaining] = useState(-130468.72);

    const [analyticsSummary, setAnalyticsSummary] = useState({ spent_this_month: 0, budget_total: 0, budget_remaining: 0 });
    const [monthlyData, setMonthlyData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [insightsData, setInsightsData] = useState(null);
    const [billsData, setBillsData] = useState([]);
    const [goalsData, setGoalsData] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            const userId = localStorage.getItem('currentUser') || 'usr_priya';
            try {
                // Parallel fetch for speed
                const [userRes, summaryRes, monthlyRes, categoryRes, insightsRes, billsRes, goalsRes] = await Promise.all([
                    axios.get(`http://localhost:5000/api/user/me?userId=${userId}`),
                    axios.get(`http://localhost:5000/api/analytics/summary/${userId}`),
                    axios.get(`http://localhost:5000/api/analytics/monthly/${userId}`),
                    axios.get(`http://localhost:5000/api/analytics/categories/${userId}`),
                    axios.get(`http://localhost:5000/api/insights/${userId}`),
                    axios.get(`http://localhost:5000/api/bills/${userId}`),
                    axios.get(`http://localhost:5000/api/goals/${userId}`)
                ]);

                if (userRes.data) {
                    setBankBalance(userRes.data.bank_balance);
                    setWalletBalance(userRes.data.wallet_balance);
                }
                if (summaryRes.data) setAnalyticsSummary(summaryRes.data);
                if (monthlyRes.data) setMonthlyData(monthlyRes.data);
                if (categoryRes.data) setCategoryData(categoryRes.data);
                if (insightsRes.data) setInsightsData(insightsRes.data);
                if (billsRes.data) setBillsData(billsRes.data);
                if (goalsRes.data) setGoalsData(goalsRes.data);
                
            } catch (err) {
                console.error("Failed to fetch user data", err);
            }
        };
        fetchUserData();
    }, []);

    const liveWalletBalance = walletBalance + investment;

    return (
        <div className="flex flex-col gap-5 w-full pb-10">
            {/* Header Content */}
            <div className="mb-2 mt-2">
                <h1 className="text-[22px] font-bold text-white tracking-tight mb-1">Dashboard</h1>
                <p className="text-slate-400 text-[13px]">Real-time spending intelligence</p>
            </div>

            {/* Row 1: Stat Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                <StatWidget 
                    title="Total Balance" 
                    value={bankBalance - investment} 
                    trend={-2.4} 
                    isPositive={false}
                    iconTgClass="bg-violet-600"
                    icon={
                        <svg className="w-5 h-5 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                    }
                />
                <StatWidget 
                    title="Investment Wallet" 
                    value={liveWalletBalance} 
                    trend={8.2} 
                    isPositive={true}
                    iconBgClass="bg-blue-500"
                    icon={
                        <svg className="w-5 h-5 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    }
                />
                <StatWidget 
                    title="Spent This Month" 
                    value={analyticsSummary.spent_this_month + transactions.reduce((acc, curr) => acc + curr.amount, 0)} 
                    badgeText={analyticsSummary.spent_this_month > analyticsSummary.budget_total ? "Exceeded" : "On Track"}
                    iconBgClass="bg-fuchsia-500"
                    icon={
                        <svg className="w-5 h-5 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
                    }
                />
                <StatWidget 
                    title="Budget Remaining" 
                    value={Math.max(0, analyticsSummary.budget_remaining - transactions.reduce((acc, curr) => acc + curr.amount, 0))} 
                    badgeText={analyticsSummary.budget_remaining - transactions.reduce((acc, curr) => acc + curr.amount, 0) < 0 ? "Exceeded" : "Monthly"}
                    iconBgClass="bg-fuchsia-500/80"
                    icon={
                        <svg className="w-5 h-5 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 8h2v6h-2V8zm0 8h2v2h-2v-2zm-1.73-10H14.73L21 12H3l6.27-6z" /></svg>
                    }
                />
            </div>

            {/* Row 2: Charts Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                <div className="xl:col-span-2">
                    <ExpenseChart data={monthlyData} />
                </div>
                <div className="xl:col-span-1">
                    <CategorySplit data={categoryData} />
                </div>
            </div>

            {/* Row 3: Complex Multi-Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-5 items-stretch">
                <div className="xl:col-span-1">
                    <AiInsights data={insightsData} />
                </div>
                <div className="xl:col-span-1">
                    {/* Mock Wallet auto-growing block shown in UI */}
                    <div className="glass-panel p-6 flex flex-col h-full bg-white/[0.01]">
                        <div className="flex items-center gap-2 mb-4">
                           <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                           </div>
                           <div>
                              <h3 className="text-[14px] font-bold text-white tracking-tight leading-tight">Investment Wallet</h3>
                              <p className="text-[10px] text-slate-400">Auto-growing from impulse redirects</p>
                           </div>
                        </div>
                        <div className="mt-2 text-[32px] font-bold text-white leading-none">
                            ₹{liveWalletBalance.toLocaleString('en-IN')}
                        </div>
                        <div className="text-emerald-400 text-[11px] font-bold mt-2">
                            ↗ +41.0% this week
                        </div>
                        <div className="flex-1 mt-6">
                            {/* Simple CSS graph mock */}
                            <div className="w-full h-full min-h-[60px] relative border-b border-white/10 flex items-end">
                                <div className="absolute bottom-0 w-full h-[40px] bg-gradient-to-t from-emerald-500/20 to-transparent"></div>
                                <svg width="100%" height="40" viewBox="0 0 100 40" preserveAspectRatio="none">
                                    <path d="M0 35 Q 25 35, 50 20 T 100 5" fill="none" stroke="#34D399" strokeWidth="2"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="xl:col-span-2">
                    <LiveTransactions transactions={transactions} />
                </div>
            </div>

            {/* Row 4: Trackers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <BudgetTracker budgets={budgets} />
                <UpcomingBills bills={billsData} />
                <SaveUpGoals goals={goalsData} />
            </div>

            {/* Smart Nudge Overlay (kept functional) */}
            <AnimatePresence>
                {nudge && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="fixed bottom-6 right-6 max-w-[340px] glass-panel border border-violet-500/30 p-5 shadow-[0_0_50px_rgba(139,92,246,0.3)] z-50 bg-[#0B0D17]/80"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center border border-violet-500/30 text-violet-400 font-bold">
                                AI
                            </div>
                            <h3 className="font-bold text-white text-sm tracking-tight text-gradient from-violet-400 to-fuchsia-400">
                                Smart Nudge
                            </h3>
                        </div>
                        
                        <p className="text-sm text-slate-300 leading-relaxed mb-4">{nudge.message}</p>
                        
                        {nudge.invest_amount > 0 && (
                            <div className="bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl text-xs font-medium text-emerald-400 flex items-center justify-between">
                                <span className="flex items-center gap-1.5">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    Rule Triggered
                                </span>
                                <span className="font-bold tracking-tight">+₹{nudge.invest_amount}</span>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
