import React, { useState, useEffect } from 'react';
import { Truck, CheckCircle, Package } from 'lucide-react';

export default function LogisticsSection() {
    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        // Fetch PAID orders
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:8080/api/oms/paid', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) setOrders(await res.json());
    };

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleShip = async (id) => {
        const token = localStorage.getItem('token');
        await fetch(`http://localhost:8080/api/oms/${id}/ship`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchOrders();
    };

    return (
        <div className="space-y-6">
            <div className="bg-orange-900/50 p-6 rounded-2xl border border-orange-700">
                <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                    <Truck className="text-orange-400" />
                    Logistics Dashboard
                </h2>
                <p className="text-orange-200 mt-1">Fulfillment Center</p>
            </div>

            <div className="grid gap-4">
                {orders.length === 0 && <p className="text-slate-500 italic">No orders ready for shipping.</p>}
                {orders.map(order => (
                    <div key={order.id} className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex justify-between items-center">
                        <div>
                            <div className="flex items-center gap-3">
                                <span className="text-white font-bold text-lg">Order #{order.id}</span>
                                <span className="bg-blue-900 text-blue-300 text-xs px-2 py-0.5 rounded">
                                    READY TO SHIP
                                </span>
                            </div>
                            <div className="text-slate-400 text-sm mt-1">
                                Customer: {order.customerId} | Item: {order.sku} (x{order.quantity})
                            </div>
                        </div>

                        <button
                            onClick={() => handleShip(order.id)}
                            className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-2 rounded-lg font-bold flex gap-2 items-center shadow-lg shadow-orange-900/40"
                        >
                            <Package size={20} /> Ship Now
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
