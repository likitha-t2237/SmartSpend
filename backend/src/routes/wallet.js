const express = require('express');
const router = express.Router();
const { Investment, InvestmentLog } = require('../models/Investment');
const TransferLog = require('../models/TransferLog');
const BankAccount = require('../models/BankAccount');

// GET /api/wallet/:userId — wallet overview + transfer history
router.get('/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        let wallet = await Investment.findOne({ user_id: userId });
        if (!wallet) {
            wallet = await Investment.create({ user_id: userId });
        }
        let bank = await BankAccount.findOne({ user_id: userId });
        if (!bank) {
            bank = await BankAccount.create({ user_id: userId, balance: 5000 });
        }
        const transfers = await TransferLog.find({ user_id: userId }).sort({ timestamp: -1 }).limit(30);
        const investLogs = await InvestmentLog.find({ user_id: userId }).sort({ timestamp: -1 }).limit(20);

        res.json({
            wallet: {
                total_invested: wallet.total_invested,
                this_week: wallet.this_week,
                this_month: wallet.this_month,
                weekly_cap: wallet.weekly_cap,
                redirect_percent: wallet.redirect_percent,
                category_toggles: wallet.category_toggles
            },
            bank_balance: bank.balance,
            transfers,
            investment_logs: investLogs
        });
    } catch (err) {
        console.error('Wallet route error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
