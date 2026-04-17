const BankAccount = require('../models/BankAccount');
const { Investment } = require('../models/Investment');
const TransferLog = require('../models/TransferLog');
const { getIo } = require('../sockets/socketHandlers');

const transferToWallet = async (userId, amount, transactionId) => {
    try {
        if (amount <= 0) return null;

        let bankAccount = await BankAccount.findOne({ user_id: userId });
        if (!bankAccount) {
            bankAccount = await BankAccount.create({ user_id: userId, balance: 5000 });
        }

        let actualAmount = amount;
        if (bankAccount.balance < amount) {
            actualAmount = bankAccount.balance;
        }

        if (actualAmount <= 0) {
            console.log(`[WalletEngine] Insufficient balance for user ${userId}. Skipping investment.`);
            return null;
        }

        // 1. Deduct from Bank (Atomic)
        const updatedBank = await BankAccount.findOneAndUpdate(
            { user_id: userId },
            { $inc: { balance: -actualAmount }, $set: { updated_at: new Date() } },
            { new: true }
        );

        // 2. Add to Wallet/Investment Bucket (Atomic)
        const updatedWallet = await Investment.findOneAndUpdate(
            { user_id: userId },
            { 
                $inc: { 
                    total_invested: actualAmount,
                    this_week: actualAmount,
                    this_month: actualAmount
                },
                $set: { last_updated: new Date() }
            },
            { new: true, upsert: true }
        );

        // 3. Log Transfer
        const transferLog = await TransferLog.create({
            transaction_id: `trf_${Date.now()}_${Math.floor(Math.random()*1000)}`,
            user_id: userId,
            amount: actualAmount,
            from: 'bank',
            to: 'wallet'
        });

        // 4. Emit Events
        const io = getIo();
        if (io) {
            io.emit('bank_updated', {
                payload: {
                    user_id: userId,
                    balance: updatedBank.balance
                }
            });

            io.emit('wallet_updated', {
                payload: {
                    user_id: userId,
                    total_invested: updatedWallet.total_invested,
                    this_week: updatedWallet.this_week,
                    this_month: updatedWallet.this_month
                }
            });
        }

        return {
            success: true,
            investedAmount: actualAmount,
            bankBalance: updatedBank.balance,
            walletBalance: updatedWallet.total_invested
        };
    } catch (err) {
        console.error('[WalletEngine] Transfer Error:', err);
        throw err;
    }
};

module.exports = {
    transferToWallet
};
