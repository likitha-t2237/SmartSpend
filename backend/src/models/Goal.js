const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
    goal_id: { type: String, required: true, unique: true },
    user_id: { type: String, required: true },
    title: { type: String, required: true },
    icon: { type: String, default: '🎯' },
    target_amount: { type: Number, required: true },
    saved_amount: { type: Number, default: 0 },
    color: { type: String, default: 'bg-blue-500' },
    active: { type: Boolean, default: true },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Goal', goalSchema);
