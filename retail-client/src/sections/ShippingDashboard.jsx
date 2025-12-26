import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, Printer, RefreshCw } from 'lucide-react';

export default function ShippingDashboard() {
    const [orders, setOrders] = useState([]);

    const fetchPaid = async () => {
        try {
            const res = await fetch('http://localhost:8082/api/oms/paid'); // Returns PAID orders
            const data = await res.json();
            setOrders(data);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchPaid();
        const interval = setInterval(fetchPaid, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleShip = async (id) => {
        await fetch(`http://localhost:8082/api/oms/${id}/ship`, { method: 'POST' });
        fetchPaid();
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Truck className="text-amber-400" />
                Logistics Module
            </h2>

            <div className="grid gap-4">
                <AnimatePresence>
                    {orders.map(order => (
                        <motion.div
                            key={order.id}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex justify-between items-center"
                        >
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="text-white font-bold text-lg">Order #{order.id}</span>
                                    <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded font-mono">
                                        PAID
                                    </span>
                                </div>
                                <div className="text-slate-400 text-sm">
                                    Ship To: <span className="text-slate-300">{order.customerId}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => handleShip(order.id)}
                                className="px-6 py-2 bg-amber-600 hover:bg-amber-500 text-black font-bold rounded-lg flex items-center gap-2 shadow-lg shadow-amber-900/20"
                            >
                                <Printer size={18} /> Print Label & Ship
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {orders.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                        No orders ready for shipping.
                    </div>
                )}
            </div>
        </div>
    );
}
