import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, DollarSign } from 'lucide-react';

export default function PaymentSection() {
    const [transactions, setTransactions] = useState([]);

    const fetchHistory = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:8080/api/payment/history', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setTransactions(data);
        } catch (e) {
            console.error("Failed to fetch payments", e);
        }
    };

    useEffect(() => {
        fetchHistory();
        const interval = setInterval(fetchHistory, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <CreditCard className="text-yellow-400" />
                    Global Transaction Ledger
                </h2>
            </div>

            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-900 text-slate-400 uppercase text-xs">
                        <tr>
                            <th className="p-4">Time</th>
                            <th className="p-4">Gateway</th>
                            <th className="p-4">Account</th>
                            <th className="p-4 text-right">Amount</th>
                            <th className="p-4 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700 text-slate-300 font-mono text-sm">
                        {transactions.map(tx => (
                            <tr key={tx.id} className="hover:bg-slate-700/30 transition-colors">
                                <td className="p-4 text-slate-500">
                                    {new Date(tx.timestamp).toLocaleTimeString()}
                                </td>
                                <td className="p-4 flex items-center gap-2">
                                    {tx.type === 'paypal' ? '🅿️ PayPal' : '💳 Stripe'}
                                </td>
                                <td className="p-4 opacity-70">{tx.accountId}</td>
                                <td className="p-4 text-right font-bold text-white">
                                    ${tx.amount.toFixed(2)}
                                </td>
                                <td className="p-4 text-center">
                                    {tx.success ? (
                                        <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">APPROVED</span>
                                    ) : (
                                        <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs">FAILED</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {transactions.length === 0 && (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-slate-500 italic">
                                    No transactions recorded yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </motion.div>
    )
}
