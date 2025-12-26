import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Clock, Package, RefreshCw } from 'lucide-react';

export default function CsrDashboard() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchPending = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:8080/api/oms/pending', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setOrders(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPending();
        const interval = setInterval(fetchPending, 5000); // Polling
        return () => clearInterval(interval);
    }, []);

    const handleApprove = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`http://localhost:8080/api/oms/${id}/approve`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchPending();
        } catch (e) {
            alert("Failed to approve");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Clock className="text-pink-400" />
                    Pending Approval Queue
                </h2>
                <button onClick={fetchPending} className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
                    <RefreshCw size={20} className={`text-slate-400 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            <div className="grid gap-4">
                <AnimatePresence>
                    {orders.map(order => (
                        <motion.div
                            key={order.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex justify-between items-center"
                        >
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="text-white font-bold text-lg">Order #{order.id}</span>
                                    <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded font-mono">
                                        {order.status}
                                    </span>
                                </div>
                                <div className="text-slate-400 text-sm">
                                    Customer: <span className="text-slate-300">{order.customerId}</span> |
                                    Item: <span className="text-pink-300">{order.sku}</span> (x{order.quantity})
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => handleApprove(order.id)}
                                    className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-bold flex items-center gap-2"
                                >
                                    <CheckCircle size={18} /> Approve
                                </button>
                                <button className="px-4 py-2 bg-slate-700 hover:bg-red-900/50 hover:text-red-400 text-slate-300 rounded-lg font-bold flex items-center gap-2 transition-colors">
                                    <XCircle size={18} /> Reject
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {orders.length === 0 && (
                    <div className="text-center py-12 text-slate-500 border border-dashed border-slate-800 rounded-xl">
                        No pending orders. Good job!
                    </div>
                )}
            </div>
        </div>
    );
}
