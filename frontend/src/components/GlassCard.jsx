import React from 'react';
import { motion } from 'framer-motion';

export const GlassCard = ({ children, className = '', noPadding = false, ...props }) => {
    return (
        <motion.div 
            whileHover={{ y: -2 }}
            className={`glass-panel border border-white/5 bg-white/[0.02] ${noPadding ? '' : 'p-6'} rounded-2xl ${className}`}
            {...props}
        >
            {children}
        </motion.div>
    );
};
