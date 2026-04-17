const mongoose = require('mongoose');

const transferLogSchema = new mongoose.Schema({
    transaction_id: { type: String, required: true, unique: true },
    user_id: { type: String, required: true },
    amount: { type: Number, required: true },
    from: { type: String, default: 'bank' },
    to: { type: String, default: 'wallet' },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TransferLog', transferLogSchema);
