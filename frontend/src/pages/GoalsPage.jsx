import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

export const GoalsPage = () => {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newGoal, setNewGoal] = useState({ title: '', target_amount: '', icon: '🎯' });

    const fetchGoals = async () => {
        const userId = localStorage.getItem('currentUser') || 'usr_priya';
        try {
            const res = await axios.get(`http://localhost:5000/api/goals/${userId}`);
            setGoals(res.data.goals || []);
        } catch {
            setGoals([
                { goal_id: 'g1', title: 'Emergency Fund', icon: '🛡️', target_amount: 100000, saved_amount: 67500, color: 'bg-blue-500' },
                { goal_id: 'g2', title: 'New Laptop', icon: '💻', target_amount: 80000, saved_amount: 32000, color: 'bg-indigo-400' },
                { goal_id: 'g3', title: 'Vacation', icon: '✈️', target_amount: 50000, saved_amount: 12500, color: 'bg-violet-500' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchGoals(); }, []);

    const handleCreate = async () => {
        if (!newGoal.title || !newGoal.target_amount) return;
        const userId = localStorage.getItem('currentUser') || 'usr_priya';
        try {
            await axios.post(`http://localhost:5000/api/goals/${userId}`, {
                title: newGoal.title,
                icon: newGoal.icon,
                target_amount: Number(newGoal.target_amount)
            });
            setNewGoal({ title: '', target_amount: '', icon: '🎯' });
            setShowForm(false);
            fetchGoals();
        } catch {
            // Fallback add locally
            setGoals(prev => [...prev, { goal_id: `g_${Date.now()}`, ...newGoal, target_amount: Number(newGoal.target_amount), saved_amount: 0, color: 'bg-violet-500' }]);
            setShowForm(false);
        }
    };

    if (loading) return <div className="flex items-center justify-center h-full text-slate-500">Loading goals...</div>;

    return (
        <div className="flex flex-col gap-5 w-full pb-10">
            <div className="flex items-center justify-between mt-2 mb-2">
                <div>
                    <h1 className="text-[22px] font-bold text-white tracking-tight mb-1">Goals</h1>
                    <p className="text-slate-400 text-[13px]">Track your savings milestones</p>
                </div>
                <button onClick={() => setShowForm(!showForm)} className="px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-[12px] font-semibold rounded-xl transition-colors">
                    + New Goal
                </button>
            </div>

            {/* New Goal Form */}
            {showForm && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-6 bg-white/[0.01]">
                    <h3 className="text-[14px] font-bold text-white mb-4">Create New Goal</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input value={newGoal.title} onChange={e => setNewGoal({ ...newGoal, title: e.target.value })} placeholder="Goal title" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[13px] text-white focus:outline-none focus:border-violet-500" />
                        <input type="number" value={newGoal.target_amount} onChange={e => setNewGoal({ ...newGoal, target_amount: e.target.value })} placeholder="Target amount (₹)" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[13px] text-white focus:outline-none focus:border-violet-500" />
                        <button onClick={handleCreate} className="bg-violet-600 hover:bg-violet-500 text-white text-[13px] font-semibold rounded-xl transition-colors py-3">Create Goal</button>
                    </div>
                </motion.div>
            )}

            {/* Goals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {goals.map((goal, i) => {
                    const progress = goal.target_amount > 0 ? Math.round((goal.saved_amount / goal.target_amount) * 100) : 0;
                    return (
                        <motion.div key={goal.goal_id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                            className="glass-panel p-6 bg-white/[0.01] relative overflow-hidden">
                            <div className="absolute -right-6 -top-6 w-24 h-24 bg-violet-500/10 blur-[40px] rounded-full"></div>
                            <div className="flex items-center justify-between mb-4 relative z-10">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{goal.icon}</span>
                                    <h3 className="text-[15px] font-bold text-white">{goal.title}</h3>
                                </div>
                                <span className="text-[14px] font-bold text-indigo-400">{progress}%</span>
                            </div>
                            <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden mb-3 relative z-10">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1 }}
                                    className={`h-full rounded-full ${goal.color || 'bg-blue-500'} shadow-[0_0_8px_rgba(99,102,241,0.4)]`} />
                            </div>
                            <div className="flex justify-between text-[11px] text-slate-500 relative z-10">
                                <span>₹{(goal.saved_amount / 1000).toFixed(1)}k saved</span>
                                <span>₹{(goal.target_amount / 1000).toFixed(0)}k target</span>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};
