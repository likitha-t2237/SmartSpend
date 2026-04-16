const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    transaction_id: { type: String, required: true, unique: true },
    user_id: { type: String, required: true },
    merchant_name: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String },
    category_confidence: { type: Number },
    category_corrected: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now },
    hour_of_day: { type: Number },
    day_of_week: { type: Number },
    is_weekend: { type: Boolean },
    is_night: { type: Boolean },
    impulse_score: { type: Number },
    risk_level: { type: String },
    flags: [{ type: String }],
    nudge_fired: { type: Boolean, default: false },
    nudge_id: { type: String },
    invest_triggered: { type: Number, default: 0 }
});

module.exports = mongoose.model('Transaction', transactionSchema);
