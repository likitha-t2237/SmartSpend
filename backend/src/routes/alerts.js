const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');
const Transaction = require('../models/Transaction');

// GET /api/alerts/:userId
router.get('/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        let alerts = await Alert.find({ user_id: userId }).sort({ created_at: -1 }).limit(30);

        // If no alerts exist, generate them from transaction history
        if (alerts.length === 0) {
            const recentTxns = await Transaction.find({ user_id: userId, nudge_fired: true }).sort({ timestamp: -1 }).limit(10);
            const generated = recentTxns.map((t, i) => ({
                alert_id: `alert_gen_${Date.now()}_${i}`,
                user_id: userId,
                type: t.risk_level === 'high' ? 'budget_exceeded' : 'nudge',
                title: t.risk_level === 'high' ? `High Risk: ${t.merchant_name}` : `Nudge on ${t.merchant_name}`,
                message: t.risk_level === 'high' 
                    ? `₹${t.amount} spent at ${t.merchant_name} flagged as high risk. ₹${t.invest_triggered} redirected.`
                    : `Smart nudge triggered for ₹${t.amount} ${t.category} purchase. Saved ₹${t.invest_triggered}.`,
                severity: t.risk_level === 'high' ? 'critical' : 'warning',
                metadata: { transaction_id: t.transaction_id, amount: t.amount, category: t.category },
                created_at: t.timestamp
            }));
            if (generated.length > 0) {
                alerts = await Alert.insertMany(generated);
            }
        }

        res.json({ alerts });
    } catch (err) {
        console.error('Alerts route error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT /api/alerts/:alertId/read
router.put('/:alertId/read', async (req, res) => {
    try {
        await Alert.updateOne({ alert_id: req.params.alertId }, { read: true });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
