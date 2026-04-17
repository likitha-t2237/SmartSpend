const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const { InvestmentLog } = require('../models/Investment');
const User = require('../models/User');

// Derive a personality label from real transaction behavioural patterns
const computePersonality = (txns) => {
    if (!txns || txns.length === 0) return { label: 'New Spender', type: 'new_spender' };

    const total = txns.length;
    const nightCount = txns.filter(t => (t.hour_of_day || 0) >= 21).length;
    const highRisk = txns.filter(t => t.risk_level === 'high').length;
    const catMap = {};
    txns.forEach(t => { catMap[t.category] = (catMap[t.category] || 0) + t.amount; });
    const topCategory = Object.entries(catMap).sort((a, b) => b[1] - a[1])[0]?.[0] || 'misc';
    const avgImpulse = txns.reduce((s, t) => s + (t.impulse_score || 0), 0) / total;

    const nightRatio = nightCount / total;
    const riskRatio = highRisk / total;

    if (nightRatio > 0.3 && topCategory === 'food') {
        return { label: 'Midnight Impulse Buyer', type: 'midnight_impulse_buyer' };
    } else if (riskRatio > 0.35 && topCategory === 'shopping') {
        return { label: 'Stress Spender', type: 'stress_spender' };
    } else if (avgImpulse < 3 && riskRatio < 0.1) {
        return { label: 'Controlled Spender', type: 'controlled' };
    } else if (topCategory === 'entertainment' || topCategory === 'food') {
        return { label: 'Social Butterfly', type: 'social_butterfly' };
    } else if (topCategory === 'shopping' && avgImpulse > 5) {
        return { label: 'Retail Therapy Seeker', type: 'retail_therapy' };
    } else if (avgImpulse > 6) {
        return { label: 'Impulse Buyer', type: 'impulse_buyer' };
    }
    return { label: 'Balanced Spender', type: 'balanced' };
};

// GET /api/insights/:userId — AI analytics summary with real personality inference
router.get('/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findOne({ user_id: userId });

        // Get recent transactions for analysis
        const recentTxns = await Transaction.find({ user_id: userId }).sort({ timestamp: -1 }).limit(100);
        const totalSpent = recentTxns.reduce((sum, t) => sum + t.amount, 0);
        const avgImpulse = recentTxns.length > 0 ? recentTxns.reduce((s, t) => s + (t.impulse_score || 0), 0) / recentTxns.length : 0;
        const highRiskCount = recentTxns.filter(t => t.risk_level === 'high').length;
        const nudgeFiredCount = recentTxns.filter(t => t.nudge_fired).length;

        // Compute real personality from live transaction data
        const personality = computePersonality(recentTxns);

        // Update the User record in DB so it stays in sync
        await User.findOneAndUpdate(
            { user_id: userId },
            { personality_type: personality.type, risk_score_avg: avgImpulse }
        );

        // Category breakdown
        const catMap = {};
        recentTxns.forEach(t => { catMap[t.category] = (catMap[t.category] || 0) + t.amount; });
        const categories = Object.entries(catMap).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

        // Investment effectiveness
        const investLogs = await InvestmentLog.find({ user_id: userId }).sort({ timestamp: -1 }).limit(50);
        const totalInvested = investLogs.reduce((s, l) => s + l.amount, 0);

        // Hourly spending pattern
        const hourMap = new Array(24).fill(0);
        recentTxns.forEach(t => { if (t.hour_of_day !== undefined) hourMap[t.hour_of_day] += t.amount; });

        res.json({
            personality: personality.label,
            cluster_id: 0,
            risk_score_avg: avgImpulse,
            total_transactions: recentTxns.length,
            total_spent: totalSpent,
            high_risk_count: highRiskCount,
            nudge_hit_rate: recentTxns.length > 0 ? ((nudgeFiredCount / recentTxns.length) * 100).toFixed(1) : 0,
            total_invested: totalInvested,
            savings_rate: totalSpent > 0 ? ((totalInvested / totalSpent) * 100).toFixed(1) : 0,
            category_breakdown: categories,
            hourly_pattern: hourMap,
            overspend_probability: Math.min(95, Math.round(avgImpulse * 10 + highRiskCount * 5)),
            recent_high_risk: recentTxns.filter(t => t.risk_level === 'high').slice(0, 5).map(t => ({
                merchant: t.merchant_name, amount: t.amount, category: t.category, score: t.impulse_score
            }))
        });
    } catch (err) {
        console.error('Insights route error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
