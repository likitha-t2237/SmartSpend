const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
    budget_id: { type: String, required: true, unique: true },
    user_id: { type: String, required: true },
    category: { type: String, required: true },
    daily_limit: { type: Number },
    weekly_limit: { type: Number },
    monthly_limit: { type: Number },
    warn_at_percent: { type: Number, default: 80 },
    secondary_warn_percent: { type: Number, default: 60 },
    limit_type: { type: String, default: 'soft' },
    active: { type: Boolean, default: true },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Budget', budgetSchema);
