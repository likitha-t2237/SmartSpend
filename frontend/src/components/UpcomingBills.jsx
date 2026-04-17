import React from 'react';

const mockBills = [
    { name: 'Netflix', date: 'Apr 20', amount: 649, isWarning: false },
    { name: 'Spotify', date: 'Apr 22', amount: 119, isWarning: true, alertMsg: 'Consider cancelling' },
    { name: 'Gym Membership', date: 'Apr 25', amount: 2500, isWarning: false },
    { name: 'Adobe CC', date: 'Apr 28', amount: 1675, isWarning: true, alertMsg: 'Consider cancelling' },
    { name: 'iCloud Storage', date: 'May 1', amount: 75, isWarning: true, alertMsg: 'Consider cancelling' },
];

export const UpcomingBills = ({ bills = [] }) => {
    // Fallback data if none provided
    const displayBills = bills.length > 0 ? bills : [
        { name: 'Netflix', due_date: 'Apr 20', amount: 649, status: 'unpaid' },
        { name: 'Spotify', due_date: 'Apr 22', amount: 119, status: 'unpaid' },
        { name: 'Gym Membership', due_date: 'Apr 25', amount: 2500, status: 'unpaid' },
    ];

    return (
        <div className="glass-panel p-6 flex flex-col h-full bg-white/[0.01]">
            <div className="flex items-center gap-2 mb-6">
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="text-[15px] font-bold text-white tracking-tight">Upcoming Bills</h3>
            </div>
            
            <div className="flex-1 space-y-3">
                {displayBills.map((bill, i) => {
                    const date = new Date(bill.due_date);
                    const formattedDate = isNaN(date.getTime()) ? bill.due_date : date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
                    
                    return (
                        <div 
                            key={i} 
                            className="p-3 rounded-xl border bg-white/[0.02] border-white/5 flex justify-between items-center transition-colors hover:bg-white/[0.04]"
                        >
                            <div className="flex items-center gap-3">
                                <div>
                                    <h4 className="text-[13px] font-medium text-slate-200">{bill.name}</h4>
                                    <p className="text-[11px] text-slate-500">{formattedDate}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-[14px] font-bold text-white">₹{bill.amount.toLocaleString('en-IN')}</div>
                                <div className="text-[10px] text-slate-500 mt-0.5 capitalize">{bill.status}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
