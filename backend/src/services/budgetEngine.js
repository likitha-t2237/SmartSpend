const redis = require('../config/redis');
const Budget = require('../models/Budget');

const checkBudget = async (userId, category, amount) => {
    try {
        const todayKey = `budget:${category}_spent_today:${userId}`;
        const currentSpentStr = await redis.get(todayKey) || '0';
        let currentSpent = parseFloat(currentSpentStr);
        
        // Add new amount to get updated spent
        currentSpent += amount;
        
        // Save back to redis (assuming TTL is set at midnight, simplified here)
        await redis.set(todayKey, currentSpent);

        // Fetch user budget from DB
        const budget = await Budget.findOne({ user_id: userId, category: category });
        if (!budget || !budget.daily_limit) return null;

        const percentUsed = (currentSpent / budget.daily_limit) * 100;
        let severity = 'normal';
        
        if (percentUsed > 100) {
            severity = 'exceeded';
        } else if (percentUsed >= budget.warn_at_percent) {
            severity = 'warning';
        }
        
        return {
            category,
            percent_used: percentUsed.toFixed(1),
            spent: currentSpent,
            budget: budget.daily_limit,
            remaining: budget.daily_limit - currentSpent,
            severity,
            overspend: percentUsed > 100 ? currentSpent - budget.daily_limit : 0
        };

    } catch (err) {
        console.error('Budget Check Error:', err);
        return null;
    }
};

module.exports = {
    checkBudget
};
