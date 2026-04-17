const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
    bill_id: { type: String, required: true, unique: true },
    user_id: { type: String, required: true },
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    due_date: { type: Date, required: true },
    category: { type: String, default: 'bills' },
    status: { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' },
    is_recurring: { type: Boolean, default: true }
});

module.exports = mongoose.model('Bill', billSchema);
