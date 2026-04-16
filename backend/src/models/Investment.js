const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
    user_id: { type: String, required: true, unique: true },
    total_invested: { type: Number, default: 0 },
    this_week: { type: Number, default: 0 },
    this_month: { type: Number, default: 0 },
    weekly_cap: { type: Number, default: 2000 },
    redirect_percent: { type: Number, default: 20 },
    category_toggles: { type: Map, of: Boolean, default: {} },
    last_updated: { type: Date, default: Date.now }
});

const investmentLogSchema = new mongoose.Schema({
    log_id: { type: String, required: true, unique: true },
    user_id: { type: String, required: true },
    amount: { type: Number, required: true },
    source_transaction_id: { type: String },
    source_category: { type: String },
    risk_multiplier: { type: Number, default: 1.0 },
    rule_id: { type: String },
    reason: { type: String },
    timestamp: { type: Date, default: Date.now }
});

module.exports = {
  Investment: mongoose.model('Investment', investmentSchema),
  InvestmentLog: mongoose.model('InvestmentLog', investmentLogSchema)
};
