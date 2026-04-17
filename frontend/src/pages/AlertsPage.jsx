import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { io } from 'socket.io-client';

const severityConfig = {
    critical: { bg: 'bg-rose-500/10', border: 'border-rose-500/15', icon: '🔴', textColor: 'text-rose-400' },
    warning: { bg: 'bg-amber-500/10', border: 'border-amber-500/15', icon: '🟡', textColor: 'text-amber-400' },
    info: { bg: 'bg-blue-500/10', border: 'border-blue-500/15', icon: '🔵', textColor: 'text-blue-400' },
};

export const AlertsPage = () => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem('currentUser') || 'usr_priya';

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/alerts/${userId}`);
                setAlerts(res.data.alerts || []);
            } catch {
                setAlerts([
                    { alert_id: 'a1', type: 'system', title: 'AI Engine Active', message: 'The ML pipeline is running. Alerts will appear here as nudges fire.', severity: 'info', read: true, created_at: new Date().toISOString() },
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchAlerts();

        // Live alerts via Socket.IO — prepend new nudge alerts in real-time
        const socket = io('http://localhost:5000');
        socket.on('nudge_fired', (data) => {
            const payload = data.payload;
            if (payload.user_id !== userId) return;
            const newAlert = {
                alert_id: `live_${Date.now()}`,
                type: payload.risk_level === 'high' ? 'budget_exceeded' : 'nudge',
                title: payload.risk_level === 'high' ? `🚨 High Risk Nudge Fired` : `💡 Smart Nudge Triggered`,
                message: payload.message,
                severity: payload.risk_level === 'high' ? 'critical' : 'warning',
                read: false,
                created_at: new Date().toISOString(),
            };
            setAlerts(prev => [newAlert, ...prev]);
        });

        return () => socket.disconnect();
    }, [userId]);

    const markRead = async (alertId) => {
        setAlerts(prev => prev.map(a => a.alert_id === alertId ? { ...a, read: true } : a));
        try { await axios.put(`http://localhost:5000/api/alerts/${alertId}/read`); } catch {}
    };

    const unread = alerts.filter(a => !a.read).length;

    if (loading) return <div className="flex items-center justify-center h-full text-slate-500">Loading alerts...</div>;

    return (
        <div className="flex flex-col gap-5 w-full pb-10">
            <div className="flex items-center justify-between mt-2 mb-2">
                <div>
                    <h1 className="text-[22px] font-bold text-white tracking-tight mb-1">Alerts</h1>
                    <p className="text-slate-400 text-[13px]">Budget warnings, nudge notifications, and system updates — live feed</p>
                </div>
                {unread > 0 && (
                    <div className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-3 py-1.5 rounded-xl text-[12px] font-bold animate-pulse">
                        {unread} unread
                    </div>
                )}
            </div>

            {alerts.length === 0 && (
                <div className="glass-panel p-10 text-center text-slate-500 text-[13px]">
                    No alerts yet. Start the live stream to see nudges appear here in real-time.
                </div>
            )}

            <div className="space-y-3">
                {alerts.map((alert, i) => {
                    const cfg = severityConfig[alert.severity] || severityConfig.info;
                    return (
                        <motion.div key={alert.alert_id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                            onClick={() => !alert.read && markRead(alert.alert_id)}
                            className={`glass-panel p-5 bg-white/[0.01] cursor-pointer transition-all border ${!alert.read ? cfg.border : 'border-white/[0.03]'} ${!alert.read ? cfg.bg : ''}`}>
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-3">
                                    <span className="text-lg mt-0.5">{cfg.icon}</span>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className={`text-[14px] font-semibold ${!alert.read ? 'text-white' : 'text-slate-400'}`}>{alert.title}</h3>
                                            {!alert.read && <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse"></span>}
                                        </div>
                                        <p className="text-[12px] text-slate-500 leading-relaxed">{alert.message}</p>
                                    </div>
                                </div>
                                <div className="text-[10px] text-slate-600 whitespace-nowrap mt-1">
                                    {new Date(alert.created_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};
