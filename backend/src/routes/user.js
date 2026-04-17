const express = require('express');
const router = express.Router();
const User = require('../models/User');
const BankAccount = require('../models/BankAccount');
const { Investment } = require('../models/Investment');

router.get('/me', async (req, res) => {
    try {
        const userId = req.query.userId || 'demo_user';
        let user = await User.findOne({ user_id: userId });
        if (!user) user = await User.findOne();
        if (!user) return res.status(404).json({ error: 'User not found' });

        let bankAccount = await BankAccount.findOne({ user_id: user.user_id });
        if (!bankAccount) bankAccount = await BankAccount.create({ user_id: user.user_id, balance: 5000 });

        let wallet = await Investment.findOne({ user_id: user.user_id });
        if (!wallet) wallet = await Investment.create({ user_id: user.user_id });

        res.json({
            user_id: user.user_id,
            bank_balance: bankAccount.balance,
            wallet_balance: wallet.total_invested,
            wallet_this_week: wallet.this_week,
            wallet_this_month: wallet.this_month,
            weekly_cap: wallet.weekly_cap
        });
    } catch (err) {
        console.error('Error fetching /me:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/user/settings/:userId — load current settings for SettingsPage
router.get('/settings/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findOne({ user_id: userId });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const wallet = await Investment.findOne({ user_id: userId });

        res.json({
            name: user.name,
            email: user.email,
            nudge_style: user.nudge_style_preference || 'moderate',
            redirect_percent: wallet ? wallet.redirect_percent : 20,
            weekly_cap: wallet ? wallet.weekly_cap : 2000,
            notifications: true,
            auto_invest: true
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT /api/user/settings/:userId — persist settings from SettingsPage
router.put('/settings/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const { name, email, nudge_style, redirect_percent, weekly_cap } = req.body;

        await User.findOneAndUpdate(
            { user_id: userId },
            { name, email, nudge_style_preference: nudge_style }
        );

        await Investment.findOneAndUpdate(
            { user_id: userId },
            { redirect_percent: Number(redirect_percent), weekly_cap: Number(weekly_cap) },
            { upsert: true }
        );

        res.json({ success: true, message: 'Settings saved successfully' });
    } catch (err) {
        console.error('Settings save error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
