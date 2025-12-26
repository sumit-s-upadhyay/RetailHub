import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Package, CheckCircle, Clock, Wallet, Plus } from 'lucide-react';

export default function StorefrontSection({ currentUser }) {
    const [products, setProducts] = useState([]);
    const [myOrders, setMyOrders] = useState([]);
    const [balance, setBalance] = useState(0);
    const [notification, setNotification] = useState(null);

    // Auth Context passed from App
    const customer = currentUser || "guest";

    const fetchData = async () => {
        try {
            // Products
            const resProd = await fetch('http://localhost:8085/api/inventory/products');
            setProducts(await resProd.json());

            // Orders
            const resOrd = await fetch(`http://localhost:8082/api/oms/my-orders?customer=${customer}`);
            if (resOrd.ok) setMyOrders(await resOrd.json());

            // Wallet (UPDATED PORT TO 8084)
            const resWal = await fetch(`http://localhost:8084/api/payment/wallet/balance?username=${customer}`);
            if (resWal.ok) setBalance(await resWal.json());

        } catch (e) { console.error("Data Sync Error", e); }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 2000);
        return () => clearInterval(interval);
    }, [customer]);

    const handleBuy = async (product) => {
        try {
            const url = `http://localhost:8082/api/oms/create?sku=${product.sku}&qty=1&customer=${customer}`;
            const res = await fetch(url, { method: 'POST' });

            if (res.ok) {
                showNotification(`Order placed for ${product.name}`, 'success');
                fetchData();
            } else {
                showNotification('Failed to place order', 'error');
            }
        } catch (e) {
            showNotification('Network Error', 'error');
        }
    };

    const handlePay = async (orderId, amount) => {
        if (balance < amount) {
            showNotification('Insufficient Funds in Wallet!', 'error');
            return;
        }

        try {
            const res = await fetch(`http://localhost:8082/api/oms/${orderId}/pay`, { method: 'POST' });
            if (res.ok) {
                showNotification('Paid via Wallet! Shipping soon.', 'success');
                fetchData();
            } else {
                showNotification('Payment Failed', 'error');
            }
        } catch (e) {
            showNotification('Payment Network Error', 'error');
        }
    };

    const handleAddFunds = async () => {
        try {
            // UPDATED PORT TO 8084
            await fetch(`http://localhost:8084/api/payment/wallet/add?username=${customer}&amount=500`, { method: 'POST' });
            showNotification('Added $500 to Wallet!', 'success');
            fetchData();
        } catch (e) {
            showNotification('Failed to add funds', 'error');
        }
    };

    const showNotification = (msg, type) => {
        setNotification({ msg, type });
        setTimeout(() => setNotification(null), 3000);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8 relative"
        >
            {/* Header with Wallet */}
            <div className="flex justify-between items-center bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                <div>
                    <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                        <ShoppingBag className="text-pink-500" />
                        Storefront
                    </h2>
                    <p className="text-slate-400 mt-1">Hello, <span className="text-pink-300 font-mono">{customer}</span></p>
                </div>

                <div className="text-right">
                    <div className="text-slate-400 text-sm mb-1 flex items-center justify-end gap-2">
                        <Wallet size={16} /> Digital Wallet
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-3xl font-bold text-green-400 font-mono">
                            ${balance.toFixed(2)}
                        </div>
                        <button
                            onClick={handleAddFunds}
                            className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-full transition-colors flex items-center justify-center w-10 h-10 shadow-lg"
                            title="Add $500"
                        >
                            <Plus size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Notification Toast */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-xl shadow-2xl border flex items-center gap-3 ${notification.type === 'success'
                                ? 'bg-slate-900 border-green-500 text-green-400'
                                : 'bg-slate-900 border-red-500 text-red-400'
                            }`}
                    >
                        {notification.type === 'success' ? <CheckCircle size={20} /> : <Clock size={20} />}
                        <span className="font-bold">{notification.msg}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                    <div key={product.sku} className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-xl flex flex-col hover:-translate-y-1 transition-transform duration-300">
                        <div className="h-40 bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center relative">
                            <Package size={48} className="text-slate-400 opacity-50" />
                            <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded font-mono">
                                {product.sku}
                            </div>
                        </div>

                        <div className="p-6 flex-1 flex flex-col">
                            <h3 className="text-xl font-bold text-white mb-1">{product.name}</h3>
                            <div className="mt-auto flex justify-between items-center pt-4">
                                <div className="text-sm">
                                    <span className="text-slate-500 block">Stock</span>
                                    <span className={`text-lg font-bold ${product.quantity > 0 ? 'text-white' : 'text-red-500'}`}>
                                        {product.quantity}
                                    </span>
                                </div>
                                <button
                                    onClick={() => handleBuy(product)}
                                    disabled={product.quantity === 0}
                                    className="bg-pink-600 hover:bg-pink-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-bold transition-all"
                                >
                                    {product.quantity > 0 ? 'Buy' : 'Out'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* MY ORDERS SECTION */}
            <div className="pt-8 border-t border-slate-800">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Clock size={20} className="text-blue-400" />
                    My Order History
                </h3>
                <div className="grid gap-4">
                    {myOrders.map(order => (
                        <div key={order.id} className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 flex justify-between items-center group hover:bg-slate-800 transition-colors">
                            <div>
                                <div className="flex items-center gap-3">
                                    <span className="text-white font-bold text-lg">Order #{order.id}</span>
                                    <span className="bg-slate-700 text-slate-300 text-xs px-2 py-0.5 rounded">
                                        {new Date().toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="text-slate-500 text-sm mt-1">
                                    Item: <span className="text-pink-300 font-medium">{order.sku}</span> (x{order.quantity})
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <div className={`font-bold font-mono text-sm px-3 py-1 rounded-full ${order.status === 'APPROVED' ? 'bg-green-500/20 text-green-400' :
                                            order.status === 'PAID' ? 'bg-blue-500/20 text-blue-400' :
                                                order.status === 'SHIPPED' ? 'bg-amber-500/20 text-amber-400' :
                                                    'bg-slate-700 text-slate-400'
                                        }`}>
                                        {order.status}
                                    </div>
                                    <div className="text-xs text-slate-500 mt-1 font-mono">${order.amount}</div>
                                </div>

                                {/* PAY BUTTON */}
                                {order.status === 'APPROVED' && (
                                    <button
                                        onClick={() => handlePay(order.id, order.amount)}
                                        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg font-bold shadow-lg shadow-blue-900/40"
                                    >
                                        Pay
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    {myOrders.length === 0 && <div className="text-slate-500 italic p-8 text-center border border-dashed border-slate-800 rounded-xl">No recent orders found.</div>}
                </div>
            </div>
        </motion.div>
    )
}
