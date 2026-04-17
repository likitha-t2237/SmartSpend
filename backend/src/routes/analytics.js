const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const mongoose = require('mongoose');

// GET Monthly Trend (Last 12 months)
router.get('/monthly/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
        twelveMonthsAgo.setDate(1);

        const data = await Transaction.aggregate([
            {
                $match: {
                    user_id: userId,
                    timestamp: { $gte: twelveMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$timestamp" },
                        year: { $year: "$timestamp" }
                    },
                    total: { $sum: "$amount" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        // Format for Chart
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const formatted = data.map(d => ({
            name: months[d._id.month - 1],
            actual: d.total,
            predicted: d.total * 0.95 // Mocking a "prediction" for now
        }));

        res.json(formatted);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET Category Split
router.get('/categories/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const data = await Transaction.aggregate([
            { $match: { user_id: userId } },
            {
                $group: {
                    _id: "$category",
                    value: { $sum: "$amount" }
                }
            }
        ]);

        const colors = {
            food: '#F43F5E',
            transport: '#3B82F6',
            groceries: '#10B981',
            shopping: '#EAB308',
            subscription: '#8B5CF6',
            bills: '#D946EF',
            uncategorized: '#64748B'
        };

        const formatted = data.map(d => ({
            name: d._id.charAt(0).toUpperCase() + d._id.slice(1),
            value: d.value,
            color: colors[d._id] || colors.uncategorized
        }));

        res.json(formatted);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET Summary Stat
router.get('/summary/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const spentResult = await Transaction.aggregate([
            {
                $match: {
                    user_id: userId,
                    timestamp: { $gte: startOfMonth }
                }
            },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        const spent = spentResult.length > 0 ? spentResult[0].total : 0;

        // Fetch total budget
        const budgets = await Budget.find({ user_id: userId });
        const totalBudget = budgets.reduce((acc, b) => acc + (b.daily_limit * 30), 0); // Simplified monthly

        res.json({
            spent_this_month: spent,
            budget_total: totalBudget,
            budget_remaining: totalBudget - spent
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET Risk Distribution
router.get('/risk-distribution/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const data = await Transaction.aggregate([
            { $match: { user_id: userId } },
            {
                $group: {
                    _id: "$risk_level",
                    count: { $sum: 1 }
                }
            }
        ]);

        const colors = {
            high: '#F43F5E',
            medium: '#EAB308',
            low: '#10B981'
        };

        const formatted = data.map(d => {
            const label = d._id ? d._id.charAt(0).toUpperCase() + d._id.slice(1) : 'Unknown';
            return {
                name: label + ' Risk',
                value: d.count,
                color: colors[d._id] || '#64748B'
            };
        });

        res.json(formatted);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
