const { InvestmentLog } = require('../models/Investment');
const walletEngine = require('./walletEngine');

const executeInvestment = async (user, decision, aiContext, ruleResult) => {
    try {
        if (!decision || decision.investAmount <= 0) return null;

        const transactionId = `txn_inv_${Date.now()}`;
        
        // Call the wallet engine to actually perform the transfer
        const transferResult = await walletEngine.transferToWallet(
            user.user_id, 
            decision.investAmount, 
            transactionId
        );

        if (transferResult) {
            // Write the business logical log for the Investment history
            await InvestmentLog.create({
                log_id: `inv_${Date.now()}`,
                user_id: user.user_id,
                amount: transferResult.investedAmount,
                source_category: aiContext.category,
                risk_multiplier: aiContext.invest_multiplier || 1.0,
                rule_id: ruleResult ? ruleResult.rule_id : null,
                reason: 'Auto-triggered',
                source_transaction_id: transactionId
            });
        }

        return transferResult;
    } catch (err) {
        console.error('[InvestEngine] Error executing investment:', err);
        throw err;
    }
};

module.exports = {
    executeInvestment
};
