const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const mlService = require('../services/mlService');
const budgetEngine = require('../services/budgetEngine');
const ruleEngine = require('../services/ruleEngine');
const { processDecision } = require('../services/nudgeDecision');
const { getIo } = require('../sockets/socketHandlers');

router.post('/', async (req, res) => {
    try {
        const { merchant_name, amount, userId, timestamp } = req.body;
        const io = getIo();

        // 1. Fetch User
        let user = await User.findOne({ user_id: userId });
        if (!user) {
            // Mock user creation for demo if missing
            user = await User.create({ user_id: userId, name: 'Demo User', email: 'demo@demo.com' });
        }

        // 2. ML Categorise
        const catResult = await mlService.categoriseTransaction(merchant_name, amount);
        
        // 3. Create raw transaction
        const txn = new Transaction({
            transaction_id: `txn_${Date.now()}`,
            user_id: user.user_id,
            merchant_name,
            amount,
            category: catResult.category,
            category_confidence: catResult.confidence,
            timestamp: timestamp || new Date(),
            hour_of_day: new Date().getHours() // mock
        });

        // 4. Budget check
        const budgetResult = await budgetEngine.checkBudget(user.user_id, catResult.category, amount);
        
        // Emit Budget Socket Events
        if (budgetResult) {
            if (budgetResult.severity === 'warning') {
                io.emit('budget_warning', { payload: { user_id: user.user_id, ...budgetResult } });
            } else if (budgetResult.severity === 'exceeded') {
                io.emit('budget_exceeded', { payload: { user_id: user.user_id, ...budgetResult } });
            }
        }

        // 5. Build AI Context for Scoring
        const scoreData = {
            user_id: user.user_id,
            category: catResult.category,
            amount: amount,
            hour_of_day: txn.hour_of_day,
            same_category_count_today: 1, // simplified
            budget_remaining_percent: budgetResult ? (budgetResult.remaining / budgetResult.budget) : 1.0,
            is_weekend: false,
            payday_proximity: 10,
            time_since_last_same_merchant_mins: 100
        };

        const scoreResult = await mlService.scoreTransaction(scoreData);
        txn.impulse_score = scoreResult.impulse_score;
        txn.risk_level = scoreResult.risk_level;
        txn.flags = scoreResult.flags;

        // 6. Cluster
        const cluster = await mlService.getCluster(user.user_id);
        
        // 7. Assemble Ai context
        const aiContext = { 
            ...scoreResult, 
            category: catResult.category, 
            amount,
            personality: cluster
        };

        // Emit new_transaction 
        io.emit('new_transaction', {
            payload: {
                transaction_id: txn.transaction_id,
                user_id: user.user_id,
                merchant_name, amount,
                category: catResult.category,
                confidence: catResult.confidence,
                timestamp: txn.timestamp,
                impulse_score: scoreResult.impulse_score,
                risk_level: scoreResult.risk_level
            }
        });

        // 8. Rule Engine
        const ruleResult = await ruleEngine.evaluateRules(user.user_id, aiContext);

        // 9-11. Nudge Decision and invest
        const decision = await processDecision(user, aiContext, ruleResult, budgetResult);
        
        if (decision && decision.fired) {
            txn.nudge_fired = true;
            txn.nudge_id = decision.nudgeId;
            txn.invest_triggered = decision.investAmount;
            
            io.emit('nudge_fired', {
                payload: {
                    user_id: user.user_id,
                    nudge_id: decision.nudgeId,
                    message: decision.message,
                    intensity: decision.intensity,
                    invest_amount: decision.investAmount,
                    category: catResult.category,
                    risk_level: scoreResult.risk_level
                }
            });

            if (decision.investAmount > 0) {
                io.emit('investment_made', {
                    payload: {
                        user_id: user.user_id,
                        amount: decision.investAmount,
                        category: catResult.category,
                        source: 'auto_rule' // simplified
                    }
                });
            }
        }

        await txn.save();
        res.status(201).json(txn);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Pipeline error' });
    }
});

router.get('/:userId', async (req, res) => {
    try {
        const txns = await Transaction.find({ user_id: req.params.userId }).sort({ timestamp: -1 }).limit(20);
        res.json({ transactions: txns });
    } catch (err) {
        res.status(500).json({ error: 'DB Error' });
    }
});

module.exports = router;
