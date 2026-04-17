const mongoose = require('mongoose');
const User = require('../src/models/User');
const BankAccount = require('../src/models/BankAccount');
const { Investment, InvestmentLog } = require('../src/models/Investment');
const Budget = require('../src/models/Budget');
const Rule = require('../src/models/Rule');
const Transaction = require('../src/models/Transaction');
const Bill = require('../src/models/Bill');
const Goal = require('../src/models/Goal');
const Alert = require('../src/models/Alert');
const TransferLog = require('../src/models/TransferLog');
require('dotenv').config();

// ─────────────────────────────────────────────
// USER PROFILES
// ─────────────────────────────────────────────
const userProfiles = [
    {
        user_id: 'usr_priya',
        name: 'Priya Sharma',
        email: 'priya@spendsmart.io',
        personality_type: 'controlled',
        risk_score_avg: 1.4,
        bankBalance: 220000,
        walletTotal: 32000,
        thisWeek: 1200,
        thisMonth: 6800,
        weeklyInvestCap: 500,
        redirectPercent: 10,
        budgets: [
            { category: 'food',         daily_limit: 300,  warn_at_percent: 80 },
            { category: 'groceries',    daily_limit: 600,  warn_at_percent: 75 },
            { category: 'transport',    daily_limit: 200,  warn_at_percent: 80 },
            { category: 'bills',        daily_limit: 2000, warn_at_percent: 90 },
            { category: 'subscription', daily_limit: 300,  warn_at_percent: 90 },
            { category: 'shopping',     daily_limit: 500,  warn_at_percent: 80 },
        ],
        bills: [
            { name: 'Monthly Rent',      amount: 9000,  due_date: 25, icon: '🏠' },
            { name: 'BESCOM Electricity',amount: 890,   due_date: 10, icon: '⚡' },
            { name: 'Airtel Postpaid',   amount: 399,   due_date: 5,  icon: '📱' },
            { name: 'LIC Premium',       amount: 1200,  due_date: 15, icon: '🛡️' },
        ],
        goals: [
            { title: 'Emergency Fund',     target_amount: 200000, saved_amount: 68000,  icon: '🛡️', color: 'bg-blue-500'   },
            { title: 'Home Downpayment',   target_amount: 500000, saved_amount: 145000, icon: '🏠', color: 'bg-emerald-500' },
            { title: 'South India Trip',   target_amount: 60000,  saved_amount: 42000,  icon: '✈️', color: 'bg-violet-500'  },
        ],
        // Historical — LOW spend, daytime, groceries & transport
        historicalPattern: {
            merchants: ['DMart', 'Nilgiris', 'BMTC Bus', 'Namma Metro', 'Ola Auto', 'Akshaya Canteen', 'Darshini Hotel', 'Reliance Fresh'],
            categories: ['groceries','groceries','transport','transport','food','bills','subscription'],
            amountRange: [45, 700],
            hours: [8, 9, 10, 11, 12, 13, 14, 15, 16],
            riskLevel: 'low',
            impulseRange: [0.5, 2.5],
        },
        investmentLogs: [
            { amount: 45,  source_category: 'food',      reason: 'Gentle nudge — daytime cafe visit',         risk_multiplier: 1.0, daysAgo: 2 },
            { amount: 60,  source_category: 'groceries', reason: 'Rule-based micro-redirect on grocery run',   risk_multiplier: 1.0, daysAgo: 5 },
            { amount: 35,  source_category: 'transport', reason: 'Auto-redirect from transport budget surplus', risk_multiplier: 1.0, daysAgo: 9 },
            { amount: 80,  source_category: 'food',      reason: 'Budget 80% warning triggered',               risk_multiplier: 1.0, daysAgo: 14 },
            { amount: 50,  source_category: 'groceries', reason: 'Weekly savings top-up',                      risk_multiplier: 1.0, daysAgo: 18 },
        ],
        alerts: [
            { type: 'goal_milestone', title: 'Emergency Fund: 34% Reached', message: 'You passed ₹68,000 for your Emergency Fund!', severity: 'info', daysAgo: 2 },
            { type: 'nudge', title: 'Smart Nudge on DMart', message: 'Great job tracking groceries! ₹60 redirected.', severity: 'info', daysAgo: 5 },
            { type: 'system', title: 'Budget Limit Refresh', message: 'Your monthly budgets have been reset.', severity: 'info', daysAgo: 15 }
        ],
        transfers: [
            { amount: 45, from: 'bank', to: 'wallet', daysAgo: 2 },
            { amount: 60, from: 'bank', to: 'wallet', daysAgo: 5 },
            { amount: 35, from: 'bank', to: 'wallet', daysAgo: 9 },
            { amount: 80, from: 'bank', to: 'wallet', daysAgo: 14 }
        ]
    },
    {
        user_id: 'usr_karan',
        name: 'Karan Mehta',
        email: 'karan@spendsmart.io',
        personality_type: 'social_butterfly',
        risk_score_avg: 5.2,
        bankBalance: 145000,
        walletTotal: 18000,
        thisWeek: 3400,
        thisMonth: 12600,
        weeklyInvestCap: 2000,
        redirectPercent: 20,
        budgets: [
            { category: 'food',          daily_limit: 1500, warn_at_percent: 75 },
            { category: 'shopping',      daily_limit: 2500, warn_at_percent: 70 },
            { category: 'entertainment', daily_limit: 1000, warn_at_percent: 75 },
            { category: 'transport',     daily_limit: 600,  warn_at_percent: 80 },
            { category: 'groceries',     daily_limit: 700,  warn_at_percent: 80 },
            { category: 'subscription',  daily_limit: 800,  warn_at_percent: 90 },
            { category: 'bills',         daily_limit: 2000, warn_at_percent: 90 },
        ],
        bills: [
            { name: 'Monthly Rent',       amount: 18000, due_date: 1,  icon: '🏠' },
            { name: 'Netflix',            amount: 649,   due_date: 8,  icon: '🎬' },
            { name: 'Spotify',            amount: 299,   due_date: 12, icon: '🎵' },
            { name: 'Gym Membership',     amount: 2500,  due_date: 1,  icon: '💪' },
            { name: 'Airtel Broadband',   amount: 999,   due_date: 20, icon: '📡' },
        ],
        goals: [
            { title: 'iPhone 16 Pro',       target_amount: 130000, saved_amount: 41000, icon: '📱', color: 'bg-blue-500'    },
            { title: 'Goa Trip',            target_amount: 35000,  saved_amount: 18000, icon: '🏖️', color: 'bg-amber-500'   },
            { title: 'Emergency Buffer',    target_amount: 100000, saved_amount: 22000, icon: '🛡️', color: 'bg-rose-500'    },
        ],
        // Historical — evening food, weekend shopping, entertainment
        historicalPattern: {
            merchants: ['Swiggy', 'Zomato', 'H&M', 'Ajio', 'Uber', 'BookMyShow', 'PVR Cinemas', 'Myntra', 'Blinkit', 'Dominos'],
            categories: ['food','food','shopping','shopping','transport','entertainment','entertainment','groceries'],
            amountRange: [300, 2800],
            hours: [18, 19, 20, 21, 22, 15, 16, 17],
            riskLevel: 'medium',
            impulseRange: [3.5, 6.5],
        },
        investmentLogs: [
            { amount: 520,  source_category: 'shopping',      reason: 'Moderate nudge — Myntra weekend splurge',    risk_multiplier: 1.25, daysAgo: 1 },
            { amount: 340,  source_category: 'food',          reason: 'Late-night Zomato redirect (21:30)',          risk_multiplier: 1.25, daysAgo: 3 },
            { amount: 280,  source_category: 'entertainment', reason: 'BookMyShow budget 80% warning',               risk_multiplier: 1.0,  daysAgo: 5 },
            { amount: 650,  source_category: 'shopping',      reason: 'H&M impulse redirect — high frequency',       risk_multiplier: 1.25, daysAgo: 8 },
            { amount: 410,  source_category: 'food',          reason: 'Swiggy + Dominos same evening — auto-invest', risk_multiplier: 1.25, daysAgo: 11 },
            { amount: 300,  source_category: 'transport',     reason: 'Rule: Uber after midnight triggered',         risk_multiplier: 1.0,  daysAgo: 15 },
            { amount: 850,  source_category: 'shopping',      reason: 'Budget exceeded: Shopping ₹2600 > ₹2500',     risk_multiplier: 1.5,  daysAgo: 20 },
        ],
        alerts: [
            { type: 'nudge', title: 'Nudge on Myntra', message: 'Moderate nudge triggered for ₹2600 shopping. ₹520 redirected.', severity: 'warning', daysAgo: 1 },
            { type: 'budget_warning', title: 'Budget at 80%: Entertainment', message: 'You have spent 80% of your Entertainment budget.', severity: 'warning', daysAgo: 5 },
            { type: 'budget_exceeded', title: 'Budget Exceeded: Shopping', message: 'You went ₹100 over your Shopping limits.', severity: 'critical', daysAgo: 20 }
        ],
        transfers: [
            { amount: 520, from: 'bank', to: 'wallet', daysAgo: 1 },
            { amount: 340, from: 'bank', to: 'wallet', daysAgo: 3 },
            { amount: 280, from: 'bank', to: 'wallet', daysAgo: 5 },
            { amount: 650, from: 'bank', to: 'wallet', daysAgo: 8 }
        ]
    },
    {
        user_id: 'usr_ravi',
        name: 'Ravi Krishnan',
        email: 'ravi@spendsmart.io',
        personality_type: 'midnight_impulse_buyer',
        risk_score_avg: 8.6,
        bankBalance: 62000,
        walletTotal: 4800,
        thisWeek: 8200,
        thisMonth: 31500,
        weeklyInvestCap: 5000,
        redirectPercent: 35,
        budgets: [
            { category: 'food',     daily_limit: 1200, warn_at_percent: 60 },
            { category: 'shopping', daily_limit: 3000, warn_at_percent: 60 },
            { category: 'transport',daily_limit: 600,  warn_at_percent: 70 },
            { category: 'bills',    daily_limit: 2000, warn_at_percent: 90 },
            { category: 'groceries',daily_limit: 500,  warn_at_percent: 70 },
        ],
        bills: [
            { name: 'Monthly Rent',    amount: 22000, due_date: 1,  icon: '🏠' },
            { name: 'Credit Card EMI', amount: 8500,  due_date: 10, icon: '💳' },
            { name: 'Amazon Prime',    amount: 1499,  due_date: 18, icon: '📦' },
            { name: 'Swiggy One',      amount: 299,   due_date: 22, icon: '🛵' },
        ],
        goals: [
            { title: 'Pay Off Credit Card', target_amount: 85000,  saved_amount: 12000, icon: '💳', color: 'bg-rose-500'    },
            { title: 'MacBook Pro',          target_amount: 200000, saved_amount: 8000,  icon: '💻', color: 'bg-blue-500'    },
            { title: 'Singapore Trip',       target_amount: 120000, saved_amount: 5000,  icon: '✈️', color: 'bg-violet-500'  },
        ],
        // Historical — midnight food delivery, high-value shopping, all bust budgets
        historicalPattern: {
            merchants: ['Zomato', 'Swiggy', 'Nike', 'Croma', 'Apple Store', 'Adidas', 'Amazon', 'Myntra', 'Flipkart', 'Puma'],
            categories: ['food','food','shopping','shopping','shopping','shopping','food','transport'],
            amountRange: [1500, 12000],
            hours: [22, 23, 0, 1, 2, 21, 23, 0],
            riskLevel: 'high',
            impulseRange: [7.5, 10],
        },
        investmentLogs: [
            { amount: 2800,  source_category: 'shopping',  reason: '🚨 Critical: Nike ₹5200 at 11pm — strong redirect',    risk_multiplier: 1.5, daysAgo: 1 },
            { amount: 1750,  source_category: 'food',      reason: '🌙 Midnight Zomato binge (3rd order) auto-invest',      risk_multiplier: 1.5, daysAgo: 2 },
            { amount: 3200,  source_category: 'shopping',  reason: '🚨 Croma ₹9500 at 01:00am — forced invest',             risk_multiplier: 1.5, daysAgo: 3 },
            { amount: 1900,  source_category: 'food',      reason: 'Swiggy budget critical: 4th order this day',           risk_multiplier: 1.5, daysAgo: 4 },
            { amount: 4200,  source_category: 'shopping',  reason: '🚨 Apple Store ₹12k impulse — high-intensity redirect',  risk_multiplier: 1.5, daysAgo: 5 },
            { amount: 2100,  source_category: 'food',      reason: 'Night-time Zomato + Swiggy double order',              risk_multiplier: 1.5, daysAgo: 7 },
            { amount: 3800,  source_category: 'shopping',  reason: 'Adidas ₹6300 at midnight — stress spender flag',       risk_multiplier: 1.5, daysAgo: 10 },
            { amount: 2400,  source_category: 'food',      reason: 'Rapid re-order: Zomato 2x within 90 mins',            risk_multiplier: 1.25,daysAgo: 13 },
            { amount: 5100,  source_category: 'shopping',  reason: 'Amazon ₹11k — weekly cap nearly reached',             risk_multiplier: 1.5, daysAgo: 17 },
            { amount: 1950,  source_category: 'food',      reason: 'Budget exceeded: food ₹3100 > ₹1200 daily limit',     risk_multiplier: 1.5, daysAgo: 22 },
        ],
        alerts: [
            { type: 'budget_exceeded', title: 'Budget Exceeded: Shopping', message: '🚨 Critical limit breach on Nike. ₹2800 forced redirect.', severity: 'critical', daysAgo: 1 },
            { type: 'budget_exceeded', title: 'High Risk Alert: Croma', message: '₹9500 spent at 01:00 AM. 1.5x impulse penalty applied.', severity: 'critical', daysAgo: 3 },
            { type: 'budget_warning', title: 'Swiggy Alert', message: '4th order today detected. Next transaction blocked.', severity: 'warning', daysAgo: 4 },
            { type: 'budget_exceeded', title: 'Apple Store Impulse', message: 'Midnight impulse buy matching stress patterns. Forced ₹4200 investment.', severity: 'critical', daysAgo: 5 }
        ],
        transfers: [
            { amount: 2800, from: 'bank', to: 'wallet', daysAgo: 1 },
            { amount: 1750, from: 'bank', to: 'wallet', daysAgo: 2 },
            { amount: 3200, from: 'bank', to: 'wallet', daysAgo: 3 },
            { amount: 1900, from: 'bank', to: 'wallet', daysAgo: 4 },
            { amount: 4200, from: 'bank', to: 'wallet', daysAgo: 5 }
        ]
    }
];

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB...');

        // ── Wipe everything clean ──
        await Transaction.deleteMany({});
        await Bill.deleteMany({});
        await Goal.deleteMany({});
        await Alert.deleteMany({});
        await InvestmentLog.deleteMany({});
        await TransferLog.deleteMany({});
        console.log('Cleared existing data.');

        for (const p of userProfiles) {
            // 1. User record
            await User.findOneAndUpdate(
                { user_id: p.user_id },
                { user_id: p.user_id, name: p.name, email: p.email, personality_type: p.personality_type, risk_score_avg: p.risk_score_avg },
                { upsert: true, new: true }
            );

            // 2. Bank Account
            await BankAccount.findOneAndUpdate(
                { user_id: p.user_id },
                { balance: p.bankBalance },
                { upsert: true }
            );

            // 3. Investment Wallet — with realistic this_week and this_month
            await Investment.findOneAndUpdate(
                { user_id: p.user_id },
                { total_invested: p.walletTotal, this_week: p.thisWeek, this_month: p.thisMonth, weekly_cap: p.weeklyInvestCap, redirect_percent: p.redirectPercent },
                { upsert: true }
            );

            // 4. Budgets
            for (const b of p.budgets) {
                await Budget.findOneAndUpdate(
                    { user_id: p.user_id, category: b.category },
                    { daily_limit: b.daily_limit, warn_at_percent: b.warn_at_percent, budget_id: `b_${p.user_id}_${b.category}` },
                    { upsert: true }
                );
            }

            // 5. Bills
            for (const b of p.bills) {
                const dueDate = new Date();
                dueDate.setDate(b.due_date);
                await Bill.create({
                    bill_id: `bill_${p.user_id}_${b.name.replace(/\s+/g, '_').toLowerCase()}`,
                    user_id: p.user_id,
                    name: b.name,
                    amount: b.amount,
                    due_date: dueDate,
                    status: 'unpaid',
                    is_recurring: true
                });
            }
            console.log(`Seeded ${p.bills.length} bills for ${p.name}`);

            // 6. Goals
            for (const g of p.goals) {
                await Goal.create({
                    goal_id: `goal_${p.user_id}_${g.title.replace(/\s+/g, '_').toLowerCase()}`,
                    user_id: p.user_id,
                    title: g.title,
                    target_amount: g.target_amount,
                    saved_amount: g.saved_amount,
                    icon: g.icon,
                    color: g.color
                });
            }
            console.log(`Seeded ${p.goals.length} goals for ${p.name}`);

            // 7. Historical Transactions (6 months, realistic profile)
            const hp = p.historicalPattern;
            const txns = [];
            for (let month = 0; month < 6; month++) {
                const txnCount = p.user_id === 'usr_ravi' ? 20 : p.user_id === 'usr_karan' ? 15 : 10;
                for (let j = 0; j < txnCount; j++) {
                    const date = new Date();
                    date.setMonth(date.getMonth() - month);
                    date.setDate(Math.floor(Math.random() * 28) + 1);
                    const hour = hp.hours[Math.floor(Math.random() * hp.hours.length)];
                    date.setHours(hour);
                    const merchant = hp.merchants[Math.floor(Math.random() * hp.merchants.length)];
                    const cat = hp.categories[Math.floor(Math.random() * hp.categories.length)];
                    const amount = Math.floor(Math.random() * (hp.amountRange[1] - hp.amountRange[0]) + hp.amountRange[0]);
                    const impulse = parseFloat((Math.random() * (hp.impulseRange[1] - hp.impulseRange[0]) + hp.impulseRange[0]).toFixed(2));

                    txns.push({
                        transaction_id: `hist_${p.user_id}_${month}_${j}`,
                        user_id: p.user_id,
                        merchant_name: merchant,
                        amount,
                        category: cat,
                        timestamp: date,
                        hour_of_day: hour,
                        impulse_score: impulse,
                        risk_level: hp.riskLevel,
                        nudge_fired: false,
                        invest_triggered: 0
                    });
                }
            }
            await Transaction.insertMany(txns);
            console.log(`Seeded ${txns.length} historical txns for ${p.name} (${hp.riskLevel} risk)`);

            // 8. Investment Logs — realistic auto-redirect history
            const invLogs = p.investmentLogs.map((l, idx) => {
                const d = new Date();
                d.setDate(d.getDate() - l.daysAgo);
                return {
                    log_id: `invlog_${p.user_id}_${idx}`,
                    user_id: p.user_id,
                    amount: l.amount,
                    source_category: l.source_category,
                    reason: l.reason,
                    risk_multiplier: l.risk_multiplier,
                    timestamp: d
                };
            });
            await InvestmentLog.insertMany(invLogs);
            console.log(`Seeded ${invLogs.length} investment logs for ${p.name}`);

            // 9. Alerts — pre-fill history
            const alerts = p.alerts.map((a, idx) => {
                const d = new Date();
                d.setDate(d.getDate() - a.daysAgo);
                return {
                    alert_id: `alert_${p.user_id}_${idx}`,
                    user_id: p.user_id,
                    type: a.type,
                    title: a.title,
                    message: a.message,
                    severity: a.severity,
                    read: true,
                    created_at: d
                };
            });
            await Alert.insertMany(alerts);

            // 10. Transfer Logs — pre-fill history
            const transLogs = p.transfers.map((t, idx) => {
                const d = new Date();
                d.setDate(d.getDate() - t.daysAgo);
                return {
                    transaction_id: `tr_${p.user_id}_${idx}`,
                    user_id: p.user_id,
                    amount: t.amount,
                    from: t.from,
                    to: t.to,
                    timestamp: d
                };
            });
            await TransferLog.insertMany(transLogs);
            console.log(`Seeded ${alerts.length} alerts and ${transLogs.length} transfers for ${p.name}`);
        }

        console.log('\n✅ Seeding complete! All 3 users have distinct profiles.');
        console.log('   Priya  → LOW risk    | Controlled Saver     | ₹2.2L bank | ₹32k wallet');
        console.log('   Karan  → MEDIUM risk | Social Butterfly     | ₹1.45L bank| ₹18k wallet');
        console.log('   Ravi   → HIGH risk   | Midnight Impulse Buy | ₹62k bank  | ₹4.8k wallet');
        process.exit(0);
    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    }
};

seed();
