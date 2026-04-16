import { useEffect, useState } from 'react';
import { socket } from '../services/socket';

export const useSocket = () => {
    const [transactions, setTransactions] = useState([]);
    const [budgets, setBudgets] = useState({});
    const [nudge, setNudge] = useState(null);
    const [investment, setInvestment] = useState(0);

    useEffect(() => {
        socket.on('new_transaction', (data) => {
            setTransactions(prev => [data.payload, ...prev]);
        });

        socket.on('budget_warning', (data) => {
            setBudgets(prev => ({ ...prev, [data.payload.category]: data.payload }));
        });

        socket.on('budget_exceeded', (data) => {
            setBudgets(prev => ({ ...prev, [data.payload.category]: data.payload }));
        });

        socket.on('nudge_fired', (data) => {
            setNudge(data.payload);
            // auto clear nudge after a few seconds
            setTimeout(() => setNudge(null), 8000);
        });

        socket.on('investment_made', (data) => {
            setInvestment(prev => prev + data.payload.amount);
        });

        return () => {
            socket.off('new_transaction');
            socket.off('budget_warning');
            socket.off('budget_exceeded');
            socket.off('nudge_fired');
            socket.off('investment_made');
        };
    }, []);

    return { transactions, budgets, nudge, investment };
};
