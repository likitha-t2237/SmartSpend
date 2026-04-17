import React from 'react';
import { motion } from 'framer-motion';

const defaultBudgets = [
    { category: 'Food', spent: 50800, budget: 12000, color: 'bg-amber-500' },
    { category: 'Shopping', spent: 63000, budget: 10000, color: 'bg-violet-500' },
    { category: 'Transport', spent: 28900, budget: 5000, color: 'bg-fuchsia-500' },
    { category: 'Subscriptions', spent: 30700, budget: 3000, color: 'bg-blue-500' },
    { category: 'Groceries', spent: 13800, budget: 8000, color: 'bg-pink-500' },
    { category: 'Entertainment', spent: 4000, budget: 5000, color: 'bg-amber-400' }
];

const categoryIcons = {
    'Food': '🍕', 'Shopping': '🛍️', 'Transport': '🚗', 
    'Subscriptions': '📺', 'Groceries': '🛒', 'Entertainment': '🎮'
};

export const BudgetProgress = ({ budgets = {} }) => {
    // If backend socket gives us budgets, we use them, otherwise fallback to visually rich mock data
    const budgetList = Object.keys(budgets).length > 0 ? Object.values(budgets) : defaultBudgets;

    return (
        <div className="glass-panel p-6 flex flex-col h-full bg-white/[0.01]">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-[15px] font-bold text-white tracking-tight">Budget Tracker</h3>
            </div>
            
            <div className="space-y-4">
                {budgetList.map((b, i) => {
                    const spent = b.spent || 0;
                    const budget = b.budget || 1;
                    const percentUsed = Math.min((spent / budget) * 100, 100);
                    const isExceeded = spent > budget;
                    const overspend = isExceeded ? spent - budget : 0;
                    
                    // Fallback colors for dynamic data
                    const barColor = b.color || (isExceeded ? 'bg-rose-500' : 'bg-emerald-500');
                    const icon = categoryIcons[b.category] || '💳';
                    
                    return (
                        <div key={i} className="group">
                            <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm">{icon}</span>
                                    <span className="capitalize text-[13px] font-medium text-slate-300">{b.category}</span>
                                </div>
                                <div className="text-[11px] font-medium text-slate-400">
                                    <span className="text-white">₹{(spent/1000).toFixed(1)}k</span> / ₹{(budget/1000).toFixed(0)}k
                                </div>
                            </div>
                            
                            <div className="w-full bg-white/5 rounded-full h-[6px] overflow-hidden relative">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentUsed}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className={`absolute left-0 top-0 h-full rounded-full shadow-[0_0_8px_rgba(255,255,255,0.2)] ${barColor}`}
                                />
                            </div>
                            
                            {isExceeded ? (
                                <p className="text-[10px] text-rose-400 mt-1.5 font-medium tracking-wide">
                                    Exceeded by ₹{overspend.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                </p>
                            ) : (
                                <div className="h-[21px]"></div> /* Placeholder to keep alignment */
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
