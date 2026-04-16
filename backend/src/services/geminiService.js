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

    // Fallback templates
    let msg = "";
    if (nudgeStyle === 'gentle') {
        msg = `Hey ${userName}, another ₹${amount} on ${category}? Just a heads up depending on your goals.`;
    } else if (nudgeStyle === 'moderate') {
        msg = `${userName}, this ${category} transaction seems impulsive based on your pattern. We've moved ₹${investAmount} to your investment bucket!`;
    } else {
        msg = `Whoa ${userName}, multiple ${category} orders! We triggered a ₹${investAmount} investment. Check your budget limit!`;
    }

    return {
        message: msg,
        intensity_used: nudgeStyle,
        generated_by: "template"
    };
};

module.exports = {
    generateNudge
};
