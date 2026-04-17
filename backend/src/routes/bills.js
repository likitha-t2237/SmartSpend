const express = require('express');
const router = express.Router();
const Bill = require('../models/Bill');

// GET upcoming bills
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const bills = await Bill.find({ user_id: userId, status: 'unpaid' }).sort({ due_date: 1 });
        res.json(bills);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST mark as paid (mock action)
router.post('/pay/:billId', async (req, res) => {
    try {
        await Bill.findOneAndUpdate({ bill_id: req.params.billId }, { status: 'paid' });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
