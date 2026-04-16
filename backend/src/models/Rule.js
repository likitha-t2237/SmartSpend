const mongoose = require('mongoose');

const ruleSchema = new mongoose.Schema({
    rule_id: { type: String, required: true, unique: true },
    user_id: { type: String, required: true },
    if_category: { type: String, required: true },
    if_condition: { type: String, required: true }, // greater_than, etc
    if_amount: { type: Number, required: true },
    if_period: { type: String, default: 'daily' },
    then_invest: { type: Number, required: true },
    nudge_style: { type: String, default: 'moderate' },
    active: { type: Boolean, default: true },
    times_triggered: { type: Number, default: 0 },
    last_triggered: { type: Date },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Rule', ruleSchema);
