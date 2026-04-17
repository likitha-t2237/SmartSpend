const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI = null;
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'mock_key_for_now') {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

const generateNudge = async (context) => {
    const { 
        userName, personalityLabel, category, amount, 
        budgetRemaining, nudgeStyle, riskLevel, flags, investAmount 
    } = context;

    if (genAI) {
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const prompt = `System: You are a friendly but firm financial coach. 
Generate a SHORT nudge message (max 2 sentences).
Tone must match the nudge_style exactly: ${nudgeStyle}.
Never use generic phrases like "You have exceeded your budget."
Always reference the user's actual spending pattern.
Include the invest amount if applicable.

User context:
- Name: ${userName}
- Spending personality: ${personalityLabel}
- Category overspent: ${category}
- Amount spent: ₹${amount}
- Budget remaining: ₹${budgetRemaining}
- Risk level: ${riskLevel}
- Active flags: ${flags.join(', ')}
- Invest amount triggered: ₹${investAmount}`;

            const result = await model.generateContent(prompt);
            return {
                message: result.response.text(),
                intensity_used: nudgeStyle,
                generated_by: "gemini-pro"
            };
        } catch (error) {
            console.error("Gemini AI failed, using fallback:", error);
        }
    }

    // --- Rich Personalised Fallback Templates ---
    const isNight = flags.includes('night_transaction');
    const isWeekend = flags.includes('weekend_spending');
    const isBudgetCritical = flags.includes('budget_critical');
    const isRapidReorder = flags.includes('rapid_reorder');
    const isHighFrequency = flags.includes('high_frequency_same_category');
    const inv = Math.round(investAmount);

    const categoryLabels = {
        food: 'food delivery', shopping: 'shopping', transport: 'transport',
        groceries: 'groceries', entertainment: 'entertainment', subscriptions: 'subscriptions',
        uncategorized: 'spending'
    };
    const catLabel = categoryLabels[category] || category;
    const name = userName || 'Hey';

    let msg = '';

    if (nudgeStyle === 'gentle') {
        if (isNight) {
            msg = `${name}, late-night ${catLabel} (₹${amount}) can add up fast — your wallet is watching! 🌙`;
        } else if (isWeekend) {
            msg = `Weekend treat! Just a heads-up, ₹${amount} on ${catLabel} — stay mindful of your monthly plan, ${name}.`;
        } else {
            msg = `FYI ${name}: ₹${amount} on ${catLabel}. You still have ₹${Math.max(0, budgetRemaining).toLocaleString()} left in this category.`;
        }
    } else if (nudgeStyle === 'moderate') {
        if (isBudgetCritical && inv > 0) {
            msg = `${name}, your ${catLabel} budget is almost gone. We've auto-moved ₹${inv} to your investment wallet to protect your savings goal 💰`;
        } else if (isRapidReorder) {
            msg = `Quick re-order alert, ${name}! Two ${catLabel} transactions close together — ₹${inv} nudged to your wallet as a small buffer.`;
        } else if (isHighFrequency) {
            msg = `${name}, ${catLabel} is your 3rd+ transaction today. Pattern detected! ₹${inv} redirected to investments to offset the impact.`;
        } else {
            msg = `${name}, this ${catLabel} spend (₹${amount}) triggered a smart redirect — ₹${inv} moved to your wallet. ${personalityLabel}s often overspend here!`;
        }
    } else { // aggressive / strong
        if (riskLevel === 'high' || riskLevel === 'critical') {
            msg = `🚨 ${name}! High-risk pattern detected — ₹${amount} on ${catLabel} when budget is critical. ₹${inv} force-invested NOW. Review your ${catLabel} limit!`;
        } else if (isNight && isBudgetCritical) {
            msg = `${name}, spending ₹${amount} on ${catLabel} at night with only ₹${Math.max(0, budgetRemaining).toLocaleString()} left? ₹${inv} locked away in investments. 🔒`;
        } else {
            msg = `STOP, ${name}! ₹${amount} on ${catLabel} pushed you into the danger zone. ₹${inv} automatically redirected. Your ${personalityLabel.toLowerCase()} pattern is costing you!`;
        }
    }

    return {
        message: msg,
        intensity_used: nudgeStyle,
        generated_by: "smart-template"
    };
};

module.exports = {
    generateNudge
};
