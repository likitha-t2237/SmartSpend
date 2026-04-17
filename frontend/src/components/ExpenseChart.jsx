import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#15172A] border border-white/10 p-3.5 rounded-xl shadow-2xl text-[13px] min-w-[120px]">
        <p className="font-semibold text-slate-300 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-4 py-0.5">
            <div className="flex items-center gap-1.5" style={{ color: entry.name === 'Actual' ? '#D946EF' : '#3B82F6' }}>
                <span className="text-[10px]">●</span>
                <span className="text-slate-400">{entry.name}</span>
            </div>
            <span className="font-bold text-white tracking-tight">
                {entry.value === 0 ? '₹0' : `₹${(entry.value / 1000).toFixed(1)}k`}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const ExpenseChart = ({ data = [] }) => {
    // Fallback data if none provided to keep the UI looking good
    const chartData = data.length > 0 ? data : [
        { name: 'Jan', actual: 38000, predicted: 36000 },
        { name: 'Feb', actual: 42000, predicted: 40000 },
        { name: 'Mar', actual: 35000, predicted: 39000 },
        { name: 'Apr', actual: 48000, predicted: 41000 },
        { name: 'May', actual: 39000, predicted: 42000 },
        { name: 'Jun', actual: 44000, predicted: 43000 }
    ];
    return (
        <div className="glass-panel h-full p-6 flex flex-col relative overflow-hidden bg-white/[0.01]">
            <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-blue-500/5 blur-[80px] rounded-full pointer-events-none"></div>

            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-[13px] font-semibold text-slate-400 mb-1 tracking-tight">Monthly Spending Trend</h3>
                    <h2 className="text-xl font-bold text-white tracking-tight">Actual vs AI Prediction</h2>
                </div>
                <div className="flex items-center gap-4 text-[12px] font-medium text-slate-300">
                    <div className="flex items-center gap-1.5"><span className="w-3 h-[2px] bg-accent-magenta rounded-full"></span> Actual</div>
                    <div className="flex items-center gap-1.5"><span className="w-3 h-[2px] border-b-2 border-dashed border-accent-blue opacity-80"></span> Predicted</div>
                </div>
            </div>
            
            <div className="flex-1 w-full mt-2 min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={chartData}
                        margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#D946EF" stopOpacity={0.4}/>
                                <stop offset="100%" stopColor="#D946EF" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.2}/>
                                <stop offset="100%" stopColor="#3B82F6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                        <XAxis dataKey="name" stroke="#64748B" className="text-[11px]" tickLine={false} axisLine={false} dy={10} />
                        <YAxis stroke="#64748B" className="text-[11px]" tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1, strokeDasharray: '4 4' }} />
                        <Area type="monotone" dataKey="actual" name="Actual" stroke="#D946EF" strokeWidth={2.5} fillOpacity={1} fill="url(#colorActual)" activeDot={{ r: 5, fill: "#D946EF", stroke: "#0B0D17", strokeWidth: 2 }} />
                        <Area type="monotone" dataKey="predicted" name="Predicted" stroke="#3B82F6" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#colorPredicted)" activeDot={{ r: 4, fill: "#3B82F6" }} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
