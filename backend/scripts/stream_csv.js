const fs = require('fs');
const path = require('path');
const axios = require('axios');
const csv = require('csv-parser');

const CSV_DIR = path.join(__dirname, '../../data');
const BACKEND_URL = 'http://localhost:5000/api/transactions';

const users = ['priya', 'karan', 'ravi'];

const streamData = async () => {
    const allTransactions = [];

    // 1. Load all CSVs
    for (const u of users) {
        const filePath = path.join(CSV_DIR, `user_${u}_transactions.csv`);
        const rows = [];
        
        await new Promise((resolve) => {
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (data) => rows.push(data))
                .on('end', () => {
                    console.log(`Loaded ${rows.length} rows for ${u}`);
                    resolve();
                });
        });
        allTransactions.push(...rows);
    }

    while (true) {
        // 2. Shuffle transactions
        allTransactions.sort(() => Math.random() - 0.5);

        console.log(`Starting stream of ${allTransactions.length} transactions...`);

        // 3. Post one by one with delay
        for (const txn of allTransactions) {
            try {
                console.log(`Streaming: ${txn.merchant_name} - ₹${txn.amount} for ${txn.user_id}`);
                await axios.post(BACKEND_URL, {
                    merchant_name: txn.merchant_name,
                    amount: parseFloat(txn.amount),
                    userId: txn.user_id,
                    timestamp: txn.timestamp
                });
                // Wait 3 seconds between transactions
                await new Promise(r => setTimeout(r, 3000));
            } catch (err) {
                console.error(`Failed to stream transaction: ${err.message}`);
                // Wait before retry
                await new Promise(r => setTimeout(r, 5000));
            }
        }
        
        console.log('Stream finished. Restarting in 5 seconds...');
        await new Promise(r => setTimeout(r, 5000));
    }
};

streamData();
