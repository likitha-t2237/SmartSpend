const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
    alert_id: { type: String, required: true, unique: true },
    user_id: { type: String, required: true },
    type: { type: String, enum: ['budget_warning', 'budget_exceeded', 'nudge', 'goal_milestone', 'system'], required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    severity: { type: String, enum: ['info', 'warning', 'critical'], default: 'info' },
    read: { type: Boolean, default: false },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Alert', alertSchema);
