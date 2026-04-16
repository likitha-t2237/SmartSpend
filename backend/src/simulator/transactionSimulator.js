const axios = require('axios');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const CSV_FILE = path.join(__dirname, '../../../data/user_ravi_transactions.csv');
const API_URL = 'http://localhost:5000/api/transactions';

async function simulate() {
    console.log('Starting Transaction Simulator for Ravi...');
    const transactions = [];

    fs.createReadStream(CSV_FILE)
        .pipe(csv())
        .on('data', (data) => transactions.push(data))
        .on('end', async () => {
            console.log(`Loaded ${transactions.length} transactions.`);
            
            for (let i = 0; i < transactions.length; i++) {
                const row = transactions[i];
                console.log(`\n[SIMULATOR] Emitting txn ${row.transaction_id}: ${row.merchant_name} -> ${row.amount}`);
                
                try {
                    await axios.post(API_URL, {
                        merchant_name: row.merchant_name,
                        amount: parseFloat(row.amount),
                        userId: row.user_id,
                        timestamp: row.timestamp
                    });
                } catch (err) {
                    console.error('Simulator POST failed:', err.message);
                }

                // Wait 4-6 seconds between transactions
                const waitTime = Math.floor(Math.random() * 2000) + 4000;
                await new Promise(resolve => setTimeout(resolve, waitTime));
            }
            console.log("Simulation complete.");
        });
}

simulate();
