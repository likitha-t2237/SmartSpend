import React, from 'react';
import { useSocket } from './hooks/useSocket';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const { transactions, budgets, nudge, investment } = useSocket();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 p-6 font-sans">
      <header className="flex justify-between items-center mb-8 pb-4 border-b border-slate-800">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
          SpendSmart
        </h1>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-slate-400">Total Auto-Invested</p>
            <motion.p 
              key={investment}
              initial={{ scale: 1.5, color: '#4ade80' }}
              animate={{ scale: 1, color: '#f8fafc' }}
              className="text-2xl font-bold text-slate-50"
            >
              ₹{investment}
            </motion.p>
          </div>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Transaction Feed */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4 text-slate-200">Live Feed</h2>
          <div className="space-y-4">
            <AnimatePresence>
              {transactions.map((txn, i) => (
                <motion.div
                  key={txn.transaction_id || i}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex justify-between items-center shadow-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-xl shadow-inner">
                      {txn.category === 'food' ? '🍔' : 
                       txn.category === 'shopping' ? '🛍️' : 
                       txn.category === 'transport' ? '🚗' : '💳'}
                    </div>
                    <div>
                      <p className="font-medium text-lg">{txn.merchant_name}</p>
                      <div className="flex gap-2 text-xs mt-1">
                        <span className="text-slate-400">{new Date(txn.timestamp).toLocaleTimeString()}</span>
                        <span className="text-blue-400 bg-blue-400/10 px-2 rounded-full">{txn.category}</span>
                        {txn.risk_level === 'high' && (
                           <span className="text-red-400 bg-red-400/10 px-2 rounded-full">High Risk ({txn.impulse_score})</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-rose-400">-₹{txn.amount}</p>
                  </div>
                </motion.div>
              ))}
              {transactions.length === 0 && (
                <p className="text-slate-500 italic">Waiting for transactions...</p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column: Budgets & Insights */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-slate-200">Live Budgets</h2>
           <div className="space-y-6">
              {Object.keys(budgets).length === 0 && (
                 <p className="text-slate-500 italic">No budget alerts yet.</p>
              )}
              {Object.values(budgets).map((b, i) => (
                 <div key={i} className="bg-slate-800 p-5 rounded-xl border border-slate-700">
                    <div className="flex justify-between mb-2">
                       <span className="capitalize font-medium">{b.category}</span>
                       <span className="text-slate-400">₹{b.spent} / ₹{b.budget}</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: \`\${Math.min(b.percent_used, 100)}%\` }}
                         className={\`h-3 rounded-full \${b.severity === 'exceeded' ? 'bg-red-500' : 'bg-amber-400'}\`}
                       />
                    </div>
                    {b.severity === 'exceeded' && (
                       <p className="text-xs text-red-400 mt-2 text-right">Over limit down by ₹{b.overspend}</p>
                    )}
                 </div>
              ))}
           </div>
        </div>

      </main>

      {/* Floating Nudge Notification */}
      <AnimatePresence>
        {nudge && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed bottom-6 right-6 max-w-sm bg-gradient-to-br from-indigo-600 to-purple-700 p-5 rounded-2xl shadow-2xl text-white border border-indigo-500/50"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold flex items-center gap-2">
                <span className="text-xl">🤖</span> Smart Nudge
              </h3>
            </div>
            <p className="text-sm leading-relaxed mb-3">{nudge.message}</p>
            {nudge.invest_amount > 0 && (
               <div className="bg-black/20 p-2 rounded-lg text-xs font-medium text-emerald-300 flex items-center justify-between">
                 <span>Rule Triggered</span>
                 <span>+₹{nudge.invest_amount} Invested</span>
               </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default App;
