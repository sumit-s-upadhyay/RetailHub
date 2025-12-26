import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Package, CheckCircle, Clock, Wallet, Plus, Search, Filter, LogOut } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import CartDrawer from '../components/CartDrawer';

export default function StorefrontSection({ currentUser }) {
    const [products, setProducts] = useState([]);
    const [myOrders, setMyOrders] = useState([]);
    const [balance, setBalance] = useState(0);
    const [notification, setNotification] = useState(null);

    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    // Filter/Search State
    const [searchTerm, setSearchTerm] = useState('');

    // Review State (passed down to modal eventually, keeping logic simple for now)
    const [activeProduct, setActiveProduct] = useState(null);
    const [reviews, setReviews] = useState([]);

    // Auth Context passed from App
    const customer = currentUser || "guest";

    const fetchData = async () => {
        try {
            const resProd = await fetch('http://localhost:8080/api/inventory/products');
            setProducts(await resProd.json());

            const resOrd = await fetch(`http://localhost:8080/api/oms/my-orders?customer=${customer}`);
            if (resOrd.ok) setMyOrders(await resOrd.json());

            const resWal = await fetch(`http://localhost:8080/api/payment/wallet/balance?username=${customer}`);
            if (resWal.ok) setBalance(await resWal.json());
        } catch (e) { console.error("Data Sync Error", e); }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 2000);
        return () => clearInterval(interval);
    }, [customer]);

    const handleAddToCart = (product) => {
        setCart(prev => [...prev, product]);
        showNotification(`Added ${product.name} to Cart`, 'success');
        setIsCartOpen(true); // Auto open cart on add
    };

    const handleCheckout = async () => {
        if (cart.length === 0) return;
        setIsCheckingOut(true);
        let successCount = 0;

        for (const item of cart) {
            try {
                const url = `http://localhost:8080/api/oms/create?sku=${item.sku}&qty=1&customer=${customer}`;
                const res = await fetch(url, { method: 'POST' });
                if (res.ok) successCount++;
            } catch (e) { console.error("Order Failed", e); }
        }

        if (successCount === cart.length) {
            showNotification(`Checkout Successful! ${successCount} orders placed.`, 'success');
            setCart([]);
            fetchData();
            setIsCartOpen(false);
        } else if (successCount > 0) {
            showNotification(`Partial Checkout: ${successCount} succeeded.`, 'warning');
            fetchData();
        } else {
            showNotification('Checkout Failed completely.', 'error');
        }
        setIsCheckingOut(false);
    };

    const handleAddFunds = async () => {
        try {
            await fetch(`http://localhost:8080/api/payment/wallet/add?username=${customer}&amount=500`, { method: 'POST' });
            showNotification('Added $500 to Wallet!', 'success');
            fetchData();
        } catch (e) { showNotification('Failed to add funds', 'error'); }
    };

    const handlePay = async (orderId, amount) => {
        if (balance < amount) {
            showNotification('Insufficient Funds in Wallet!', 'error');
            return;
        }
        try {
            const res = await fetch(`http://localhost:8080/api/oms/${orderId}/pay`, { method: 'POST' });
            if (res.ok) {
                showNotification('Paid via Wallet! Shipping soon.', 'success');
                fetchData();
            } else { showNotification('Payment Failed', 'error'); }
        } catch (e) { showNotification('Payment Network Error', 'error'); }
    };

    const handleCancel = async (orderId) => {
        try {
            const res = await fetch(`http://localhost:8080/api/oms/${orderId}/cancel`, { method: 'POST' });
            if (res.ok) {
                showNotification('Order Canceled.', 'success');
                fetchData();
            } else { showNotification('Cannot cancel order.', 'error'); }
        } catch (e) { showNotification('Network Error', 'error'); }
    };

    const showNotification = (msg, type) => {
        setNotification({ msg, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans pb-20 relative">

            {/* Sticky Header */}
            <div className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-rose-500">
                            RetailHub
                        </h1>
                        <p className="text-xs text-slate-500 font-mono">Welcome, {customer}</p>
                    </div>

                    <div className="flex-1 max-w-md mx-8 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="w-full bg-slate-900 border border-slate-800 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-pink-500/50 transition-colors"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Wallet Badge */}
                        <div className="flex items-center gap-3 bg-slate-900 px-4 py-2 rounded-full border border-slate-800 hover:border-slate-700 transition-colors">
                            <Wallet size={16} className="text-emerald-400" />
                            <span className="font-mono font-bold text-white">${balance.toFixed(2)}</span>
                            <button onClick={handleAddFunds} className="text-slate-400 hover:text-white transition-colors" title="Add Funds">
                                <Plus size={16} />
                            </button>
                        </div>

                        {/* Cart Trigger */}
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative p-2 text-slate-400 hover:text-white transition-colors"
                        >
                            <ShoppingBag size={24} />
                            {cart.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-lg border-2 border-slate-950">
                                    {cart.length}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 py-8 space-y-12">

                {/* Hero / Promo Area */}
                <div className="relative rounded-3xl overflow-hidden h-64 bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center px-12 shadow-2xl">
                    <div className="relative z-10 max-w-lg">
                        <span className="bg-white/20 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full mb-4 inline-block">NEW ARRIVALS</span>
                        <h2 className="text-4xl font-extrabold text-white mb-2">Summer Collection 2025</h2>
                        <p className="text-indigo-100 mb-6">Explore the latest trends in tech and accessories. 50% Off on selected items.</p>
                        <button className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-lg">
                            Shop Now
                        </button>
                    </div>
                    <div className="absolute right-0 top-0 h-full w-1/2 bg-[url('https://source.unsplash.com/random/1200x400/?shopping')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
                </div>

                {/* Products Grid */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold flex items-center gap-2">
                            <Package className="text-pink-500" /> Featured Products
                        </h3>
                        <button className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
                            <Filter size={16} /> Filter
                        </button>
                    </div>

                    {filteredProducts.length === 0 ? (
                        <div className="text-center py-20 bg-slate-900 rounded-2xl border border-slate-800 border-dashed">
                            <p className="text-slate-500">No products found matching "{searchTerm}"</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {filteredProducts.map(product => (
                                <ProductCard
                                    key={product.sku}
                                    product={product}
                                    onAdd={handleAddToCart}
                                    onViewDetails={setActiveProduct} // Using activeProduct state for modal later if needed
                                />
                            ))}
                        </div>
                    )}
                </section>

                {/* Order History */}
                <section className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Clock className="text-blue-500" /> Recent Orders
                    </h3>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-950/50 text-slate-500 text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="p-4 rounded-l-lg">Order ID</th>
                                    <th className="p-4">Item</th>
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Amount</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 rounded-r-lg text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {myOrders.map(order => (
                                    <tr key={order.id} className="group hover:bg-slate-800/30 transition-colors">
                                        <td className="p-4 font-mono text-slate-300">#{order.id}</td>
                                        <td className="p-4 font-medium text-white">{order.sku} <span className="text-slate-500 text-xs">x{order.quantity}</span></td>
                                        <td className="p-4 text-slate-400 text-sm">{new Date().toLocaleDateString()}</td>
                                        <td className="p-4 font-mono text-slate-300">${order.amount.toFixed(2)}</td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold 
                                                ${order.status === 'APPROVED' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                                    order.status === 'PAID' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                                        order.status === 'SHIPPED' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                                            'bg-slate-700 text-slate-300'}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right space-x-2">
                                            {order.status === 'CREATED' && (
                                                <button onClick={() => handleCancel(order.id)} className="text-red-400 hover:text-red-300 text-sm font-medium hover:underline">Cancel</button>
                                            )}
                                            {order.status === 'APPROVED' && (
                                                <button onClick={() => handlePay(order.id, order.amount)} className="text-blue-400 hover:text-blue-300 text-sm font-medium hover:underline">Pay Now</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {myOrders.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="p-8 text-center text-slate-500 italic">No orders history available.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                <footer className="text-center text-slate-600 text-sm pt-12 border-t border-slate-900">
                    &copy; 2025 RetailHub Enterprise. All rights reserved.
                </footer>
            </main>

            {/* Cart Drawer */}
            <CartDrawer
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cart={cart}
                onCheckout={handleCheckout}
                isCheckingOut={isCheckingOut}
            />

            {/* Notification Toast */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        className={`fixed bottom-6 right-6 z-[60] px-6 py-4 rounded-xl shadow-2xl border flex items-center gap-3 ${notification.type === 'success' ? 'bg-slate-900 border-green-500 text-green-400' :
                                notification.type === 'warning' ? 'bg-slate-900 border-yellow-500 text-yellow-400' :
                                    'bg-slate-900 border-red-500 text-red-400'
                            }`}
                    >
                        <CheckCircle size={20} />
                        <span className="font-bold">{notification.msg}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
