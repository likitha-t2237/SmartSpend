import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const SettingsPage = () => {
    const [settings, setSettings] = useState({
        name: '', email: '', nudge_style: 'moderate',
        redirect_percent: 20, weekly_cap: 2000,
        notifications: true, dark_mode: true, auto_invest: true,
    });
    const [saveStatus, setSaveStatus] = useState(null); // null | 'saving' | 'saved' | 'error'
    const userId = localStorage.getItem('currentUser') || 'usr_priya';

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/user/settings/${userId}`);
                setSettings(prev => ({ ...prev, ...res.data }));
            } catch (err) {
                console.error('Failed to load settings', err);
            }
        };
        loadSettings();
    }, [userId]);

    const update = (key, value) => setSettings(prev => ({ ...prev, [key]: value }));

    const handleSave = async () => {
        setSaveStatus('saving');
        try {
            await axios.put(`http://localhost:5000/api/user/settings/${userId}`, {
                name: settings.name,
                email: settings.email,
                nudge_style: settings.nudge_style,
                redirect_percent: settings.redirect_percent,
                weekly_cap: settings.weekly_cap,
            });
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus(null), 3000);
        } catch (err) {
            setSaveStatus('error');
            setTimeout(() => setSaveStatus(null), 3000);
        }
    };

    return (
        <div className="flex flex-col gap-5 w-full pb-10 max-w-3xl">
            <div className="mb-2 mt-2">
                <h1 className="text-[22px] font-bold text-white tracking-tight mb-1">Settings</h1>
                <p className="text-slate-400 text-[13px]">Manage your account preferences and nudge behavior</p>
            </div>

            {/* Profile */}
            <div className="glass-panel p-6 bg-white/[0.01]">
                <h3 className="text-[15px] font-bold text-white mb-5">Profile</h3>
                <div className="space-y-4">
                    <div>
                        <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-2 block">Name</label>
                        <input value={settings.name} onChange={e => update('name', e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[13px] text-white focus:outline-none focus:border-violet-500 transition-colors" />
                    </div>
                    <div>
                        <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-2 block">Email</label>
                        <input value={settings.email} onChange={e => update('email', e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[13px] text-white focus:outline-none focus:border-violet-500 transition-colors" />
                    </div>
                </div>
            </div>

            {/* Nudge Settings */}
            <div className="glass-panel p-6 bg-white/[0.01]">
                <h3 className="text-[15px] font-bold text-white mb-5">Nudge Preferences</h3>
                <div className="space-y-5">
                    <div>
                        <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-3 block">Nudge Intensity</label>
                        <div className="flex gap-2">
                            {['gentle', 'moderate', 'aggressive'].map(style => (
                                <button key={style} onClick={() => update('nudge_style', style)}
                                    className={`px-4 py-2.5 rounded-xl text-[12px] font-semibold capitalize border transition-all ${
                                        settings.nudge_style === style
                                            ? 'bg-violet-500/20 text-violet-300 border-violet-500/30'
                                            : 'bg-white/[0.02] text-slate-400 border-white/5 hover:bg-white/[0.04]'
                                    }`}>
                                    {style}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-2 block">Redirect Percentage</label>
                        <div className="flex items-center gap-4">
                            <input type="range" min="5" max="50" value={settings.redirect_percent} onChange={e => update('redirect_percent', Number(e.target.value))}
                                className="flex-1 accent-violet-500" />
                            <span className="text-[14px] font-bold text-violet-400 w-12 text-right">{settings.redirect_percent}%</span>
                        </div>
                    </div>
                    <div>
                        <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-2 block">Weekly Investment Cap (₹)</label>
                        <input type="number" value={settings.weekly_cap} onChange={e => update('weekly_cap', Number(e.target.value))}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[13px] text-white focus:outline-none focus:border-violet-500 transition-colors" />
                    </div>
                </div>
            </div>

            {/* Toggles */}
            <div className="glass-panel p-6 bg-white/[0.01]">
                <h3 className="text-[15px] font-bold text-white mb-5">Preferences</h3>
                <div className="space-y-4">
                    {[
                        { key: 'notifications', label: 'Push Notifications', desc: 'Receive alerts for budget warnings and nudges' },
                        { key: 'auto_invest', label: 'Auto-Invest', desc: 'Automatically redirect flagged spending to wallet' },
                        { key: 'dark_mode', label: 'Dark Mode', desc: 'App appearance (always dark for premium feel)' },
                    ].map(toggle => (
                        <div key={toggle.key} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.02] transition-colors">
                            <div>
                                <div className="text-[13px] font-medium text-slate-200">{toggle.label}</div>
                                <div className="text-[11px] text-slate-500 mt-0.5">{toggle.desc}</div>
                            </div>
                            <button onClick={() => update(toggle.key, !settings[toggle.key])}
                                className={`w-11 h-6 rounded-full transition-colors relative ${settings[toggle.key] ? 'bg-violet-500' : 'bg-white/10'}`}>
                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${settings[toggle.key] ? 'left-6' : 'left-1'}`}></div>
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <button onClick={handleSave} disabled={saveStatus === 'saving'}
                className={`w-full py-3.5 text-white text-[13px] font-semibold rounded-xl transition-all ${
                    saveStatus === 'saved' ? 'bg-emerald-600' :
                    saveStatus === 'error' ? 'bg-rose-600' :
                    'bg-violet-600 hover:bg-violet-500'
                }`}>
                {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? '✓ Settings Saved!' : saveStatus === 'error' ? '✗ Save Failed' : 'Save Settings'}
            </button>
        </div>
    );
};
