import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const Layout = () => {
    return (
        <div className="min-h-screen bg-[#0B0D17] text-white flex">
            <Sidebar />
            <div className="flex-1 md:ml-[260px] flex flex-col h-screen overflow-hidden relative">
                
                {/* Background Glows matching the design */}
                <div className="absolute -top-40 right-20 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute top-1/2 left-0 w-80 h-80 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none"></div>

                <Header />

                <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 relative z-10 w-full max-w-7xl mx-auto custom-scrollbar">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

