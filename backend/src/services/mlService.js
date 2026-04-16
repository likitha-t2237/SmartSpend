const axios = require('axios');

const ML_URL = process.env.PYTHON_ML_URL || 'http://localhost:8001';

const categoriseTransaction = async (merchant_name, amount) => {
    try {
        const response = await axios.post(`${ML_URL}/categorise`, {
            merchant_name,
            amount
        });
        return response.data;
    } catch (error) {
        console.error('Error in categorise ML:', error.message);
        return { category: 'uncategorized', confidence: 0, flagged_for_review: true };
    }
};

const scoreTransaction = async (data) => {
    try {
        const response = await axios.post(`${ML_URL}/score`, data);
        return response.data;
    } catch (error) {
        console.error('Error in score ML:', error.message);
        return { impulse_score: 0, risk_level: 'low', flags: [], nudge_intensity_recommended: 'gentle', invest_multiplier: 1.0 };
    }
};

const getCluster = async (userId) => {
    try {
        const response = await axios.get(`${ML_URL}/cluster/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error in cluster ML:', error.message);
        return { personality_type: 'unknown', personality_label: 'Unknown' };
    }
};

module.exports = {
    categoriseTransaction,
    scoreTransaction,
    getCluster
};
