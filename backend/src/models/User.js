const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    user_id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    cluster_id: { type: Number, default: 0 },
    personality_type: { type: String, default: 'controlled' },
    risk_score_avg: { type: Number, default: 0 },
    nudge_style_preference: { type: String, default: 'moderate' },
    onboarding_complete: { type: Boolean, default: true },
    created_at: { type: Date, default: Date.now },
    last_active: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
