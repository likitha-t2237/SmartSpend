const Rule = require('../models/Rule');

const evaluateRules = async (userId, aiContext) => {
    try {
        const rules = await Rule.find({ user_id: userId, active: true });
        let matchedRule = null;
        let baseInvestAmount = 0;
        let nudgeStyle = 'gentle';

        // simple matching
        for (const rule of rules) {
            if (rule.if_category !== 'any' && rule.if_category !== aiContext.category) {
                continue;
            }
            if (rule.if_condition === 'greater_than' && aiContext.amount > rule.if_amount) {
                matchedRule = rule;
                baseInvestAmount = rule.then_invest;
                nudgeStyle = rule.nudge_style;
                break;
            }
        }
        
        return {
            rule_matched: matchedRule !== null,
            rule_id: matchedRule ? matchedRule.rule_id : null,
            base_invest_amount: baseInvestAmount,
            user_nudge_style: nudgeStyle
        };
    } catch (err) {
        console.error('Rule Evaluate Error:', err);
        return { rule_matched: false };
    }
};

module.exports = {
    evaluateRules
};
