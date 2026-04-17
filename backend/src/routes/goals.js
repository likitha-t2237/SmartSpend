const express = require('express');
const router = express.Router();
const Goal = require('../models/Goal');

// GET /api/goals/:userId
router.get('/:userId', async (req, res) => {
    try {
        let goals = await Goal.find({ user_id: req.params.userId, active: true });
        if (goals.length === 0) {
            // Seed default demo goals
            const defaults = [
                { goal_id: `goal_1_${Date.now()}`, user_id: req.params.userId, title: 'Emergency Fund', icon: '🛡️', target_amount: 100000, saved_amount: 67500, color: 'bg-blue-500' },
                { goal_id: `goal_2_${Date.now()}`, user_id: req.params.userId, title: 'New Laptop', icon: '💻', target_amount: 80000, saved_amount: 32000, color: 'bg-indigo-400' },
                { goal_id: `goal_3_${Date.now()}`, user_id: req.params.userId, title: 'Vacation', icon: '✈️', target_amount: 50000, saved_amount: 12500, color: 'bg-violet-500' }
            ];
            goals = await Goal.insertMany(defaults);
        }
        res.json({ goals });
    } catch (err) {
        console.error('Goals route error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/goals/:userId — create new goal
router.post('/:userId', async (req, res) => {
    try {
        const { title, icon, target_amount } = req.body;
        const goal = await Goal.create({
            goal_id: `goal_${Date.now()}`,
            user_id: req.params.userId,
            title,
            icon: icon || '🎯',
            target_amount
        });
        res.status(201).json(goal);
    } catch (err) {
        console.error('Goal create error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
