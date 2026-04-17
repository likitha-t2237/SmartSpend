import React from 'react';
import { NavLink } from 'react-router-dom';

export const Sidebar = () => {
    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
        { path: '/transactions', label: 'Transactions', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
        { path: '/analytics', label: 'Analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
        { path: '/insights', label: 'AI Insights', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
        { path: '/wallet', label: 'Wallet', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
        { path: '/goals', label: 'Goals', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
        { path: '/investments', label: 'Investments', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
        { path: '/alerts', label: 'Alerts', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
        { path: '/settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
    ];

    return (
        <aside className="fixed top-0 left-0 h-screen w-[260px] bg-[#030510] border-r border-white/[0.03] flex flex-col hidden md:flex shrink-0 z-40">
            <div className="p-8 pb-4 pt-6 flex items-center justify-between">
                <div className="flex items-center gap-3 tracking-tight">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-fuchsia-500 to-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                        <span className="font-bold text-white text-sm">S</span>
                    </div>
                    <span className="font-bold text-[22px] tracking-tight text-white mb-[2px]">SpendSmart</span>
                </div>
            </div>
            
            <nav className="flex-1 px-4 py-8 space-y-1.5 overflow-y-auto custom-scrollbar">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
                            flex items-center gap-3.5 px-4 py-[14px] rounded-xl transition-all duration-200 font-medium text-[15px]
                            ${isActive 
                                ? 'bg-[#15172A] text-white shadow-inner border border-white/5' 
                                : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'}
                        `}
                    >
                        <svg className={`w-5 h-5 ${item.path==='/dashboard' ? 'opacity-100 text-violet-400' : 'opacity-70'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                        </svg>
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <div className="p-6 mt-auto">
                <div className="glass-panel p-4 pb-3 flex flex-col gap-2 relative overflow-hidden bg-white/[0.01]">
                    <div className="text-[13px] font-semibold text-slate-300">AI Engine</div>
                    <div className="flex flex-row items-center gap-2">
                        <div className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </div>
                        <span className="text-[12px] text-emerald-400 tracking-wide font-medium">Active & Learning</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};
