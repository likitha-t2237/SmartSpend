import React from 'react';

export const Header = () => {
    return (
        <header className="h-20 w-full flex items-center justify-between px-8 bg-transparent z-10">
            <div className="flex-1">
                <div className="relative w-96 hidden lg:block">
                    <svg className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input 
                        type="text" 
                        placeholder="Search transactions, budgets..." 
                        className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-11 pr-4 text-sm text-slate-200 focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all placeholder-slate-500"
                    />
                </div>
            </div>

            <div className="flex items-center gap-6">
                <button className="relative text-slate-400 hover:text-white transition">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#0B0D17]"></span>
                </button>
                <div className="h-8 w-px bg-white/10 hidden sm:block"></div>
                <div className="flex items-center gap-4">
                    <select 
                        onChange={(e) => {
                            localStorage.setItem('currentUser', e.target.value);
                            window.location.reload();
                        }}
                        value={localStorage.getItem('currentUser') || 'usr_priya'}
                        className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-300 focus:outline-none focus:border-violet-500 transition-all cursor-pointer"
                    >
                        <option value="usr_priya">Account: Priya</option>
                        <option value="usr_karan">Account: Karan</option>
                        <option value="usr_ravi">Account: Ravi</option>
                    </select>
                    <div className="flex items-center gap-3 cursor-pointer group">
                        <img src={`https://i.pravatar.cc/150?u=${localStorage.getItem('currentUser') || 'usr_priya'}`} alt="Profile" className="w-10 h-10 rounded-full object-cover border-2 border-white/10 group-hover:border-violet-500/50 transition" />
                        <div className="hidden sm:block text-right">
                            <p className="text-sm font-medium text-slate-200">
                                {localStorage.getItem('currentUser') === 'usr_karan' ? 'Karan' : 
                                 localStorage.getItem('currentUser') === 'usr_ravi' ? 'Ravi' : 'Priya'}
                            </p>
                            <p className="text-xs text-slate-500">Premium User</p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};
