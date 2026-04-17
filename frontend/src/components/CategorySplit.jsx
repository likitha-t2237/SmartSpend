import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[#15172A] border border-white/10 p-3 rounded-xl shadow-2xl text-[13px] min-w-[120px]">
                <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: payload[0].payload.color }}></span>
                    <span className="text-slate-300 font-medium">{payload[0].name}</span>
                </div>
                <div className="font-bold text-white mt-1">₹{payload[0].value.toLocaleString()}</div>
            </div>
        );
    }
    return null;
};

export const CategorySplit = ({ data = [] }) => {
    // Fallback data if none provided
    const chartData = data.length > 0 ? data : [
        { name: 'Food', value: 8400, color: '#F43F5E' },
        { name: 'Transport', value: 3200, color: '#3B82F6' },
        { name: 'Groceries', value: 4600, color: '#10B981' },
        { name: 'Shopping', value: 11200, color: '#EAB308' }
    ];
    return (
        <div className="glass-panel h-full p-6 flex flex-col bg-white/[0.01]">
            <h3 className="text-[14px] font-semibold text-slate-300 mb-6">Category Split</h3>
            
            <div className="flex-1 min-h-[220px] relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Tooltip content={<CustomTooltip />} />
                        <Pie
                            data={chartData}
                            innerRadius={65}
                            outerRadius={95}
                            paddingAngle={4}
                            dataKey="value"
                            stroke="rgba(255,255,255,0.05)"
                            strokeWidth={2}
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                
                {/* Center text manually if needed, but standard Recharts doesn't natively text in doughnut center without custom shape */}
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-3 mt-4 text-[12px]">
                {chartData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                            <span className="text-slate-400">{item.name}</span>
                        </div>
                        <span className="font-medium text-slate-200">
                            {item.value >= 1000 ? `₹${(item.value / 1000).toFixed(1)}k` : `₹${item.value}`}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};
