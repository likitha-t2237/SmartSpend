import React from 'react';

const mockGoals = [
    { title: 'Emergency Fund', icon: '🛡️', saved: 67.5, target: 100, color: 'bg-blue-500' },
    { title: 'New Laptop', icon: '💻', saved: 32.0, target: 80, color: 'bg-indigo-400' },
    { title: 'Vacation', icon: '✈️', saved: 12.5, target: 50, color: 'bg-indigo-500' }
];

export const SaveUpGoals = ({ goals = [] }) => {
    // Fallback data if none provided
    const displayGoals = goals.length > 0 ? goals : [
        { title: 'Emergency Fund', icon: '🛡️', saved_amount: 67500, target_amount: 100000, color: 'bg-blue-500' },
        { title: 'New Laptop', icon: '💻', saved_amount: 32000, target_amount: 80000, color: 'bg-indigo-400' },
    ];

    return (
        <div className="glass-panel p-6 flex flex-col h-full bg-white/[0.01]">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                        <div className="w-2.5 h-2.5 rounded-full bg-purple-400"></div>
                    </div>
                    <h3 className="text-[15px] font-bold text-white tracking-tight">Save-Up Goals</h3>
                </div>
            </div>
            
            <div className="flex-1 space-y-6">
                {displayGoals.map((goal, i) => {
                    const progress = Math.min(100, Math.round((goal.saved_amount / goal.target_amount) * 100));
                    return (
                        <div key={i} className="group">
                            <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm">{goal.icon}</span>
                                    <span className="text-[13px] font-medium text-slate-300">{goal.title}</span>
                                </div>
                                <span className="text-[12px] font-bold text-indigo-400">{progress}%</span>
                            </div>
                            
                            <div className="w-full bg-slate-800/50 rounded-full h-[6px] overflow-hidden relative mb-1.5">
                                <div 
                                    className={`absolute left-0 top-0 h-full rounded-full ${goal.color || 'bg-blue-500'} shadow-[0_0_8px_rgba(99,102,241,0.4)]`}
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                            
                            <div className="text-[10px] text-slate-500">
                                ₹{(goal.saved_amount / 1000).toFixed(1)}k of ₹{(goal.target_amount / 1000).toFixed(1)}k
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
