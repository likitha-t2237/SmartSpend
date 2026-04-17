const { Investment, InvestmentLog } = require('../models/Investment');
const redis = require('../config/redis');
const { generateNudge } = require('./geminiService');

const processDecision = async (user, aiContext, ruleResult, budgetResult) => {
    let finalInvestAmount = 0;
    let finalNudgeStyle = ruleResult.user_nudge_style || 'gentle';
    let proceedNudge = false;

    // Evaluate Risk override
    if (ruleResult.rule_matched) {
        proceedNudge = true;
        let baseInvest = ruleResult.base_invest_amount;
        
        // ML score multiplier applied
        let multiplier = aiContext.invest_multiplier || 1.0;
        finalInvestAmount = baseInvest * multiplier;

        if (aiContext.impulse_score > 7) {
            finalNudgeStyle = 'strong';
        } else if (aiContext.impulse_score > 4) {
            finalNudgeStyle = 'moderate';
        }
    } else if (budgetResult && budgetResult.severity === 'exceeded') {
        // Fallback or secondary investment rule (from blueprint) feature 5
        proceedNudge = true;
        let overspendAmt = budgetResult.overspend;
        let p = await Investment.findOne({ user_id: user.user_id }) || { redirect_percent: 20 };
        let baseInvest = overspendAmt * (p.redirect_percent / 100);
        let multiplier = aiContext.invest_multiplier || 1.0;
        finalInvestAmount = baseInvest * multiplier;
        finalNudgeStyle = aiContext.impulse_score > 7 ? 'strong' : 'moderate';
    }

    if (!proceedNudge) return null;

    // Process Investment Caps
    // Process Investment Caps
    const inv = await Investment.findOne({ user_id: user.user_id });
    if (inv) {
        if ((inv.this_week + finalInvestAmount) > inv.weekly_cap) {
            finalInvestAmount = inv.weekly_cap - inv.this_week;
        }
    }


    // Call Gemini for context string
    const nudge = await generateNudge({
        userName: user.name,
        personalityLabel: aiContext.personality.personality_label || 'Default',
        category: aiContext.category,
        amount: aiContext.amount,
        budgetRemaining: budgetResult ? budgetResult.remaining : 0,
        nudgeStyle: finalNudgeStyle,
        riskLevel: aiContext.risk_level,
        flags: aiContext.flags || [],
        investAmount: finalInvestAmount
    });

    return {
        fired: true,
        nudgeId: `nudge_${Date.now()}`,
        message: nudge.message,
        intensity: nudge.intensity_used,
        investAmount: finalInvestAmount
    };
};

module.exports = {
    processDecision
};
