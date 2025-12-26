import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, RefreshCw } from 'lucide-react';

export default function InventorySection() {
    const [products, setProducts] = useState([]);

    const fetchStock = async () => {
        try {
            const res = await fetch('http://localhost:8085/api/inventory/products');
            const data = await res.json();
            setProducts(data);
        } catch (e) {
            console.error("Failed to fetch inventory", e);
        }
    };

    useEffect(() => {
        fetchStock();
        // Poll every 5 seconds to see real-time updates
        const interval = setInterval(fetchStock, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
        >
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Package className="text-purple-400" />
                    Warehouse Live Stock
                </h2>
                <button onClick={fetchStock} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
                    <RefreshCw size={20} className="text-slate-400" />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                    <motion.div
                        key={product.sku}
                        layout
                        className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col justify-between"
                    >
                        <div>
                            <div className="text-xs text-slate-500 font-mono mb-1">SKU: {product.sku}</div>
                            <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
                        </div>

                        <div className="mt-4">
                            <div className="flex justify-between items-end">
                                <span className="text-slate-400 text-sm">Quantity</span>
                                <span className={`text-3xl font-bold ${product.quantity < 10 ? 'text-red-400' : 'text-green-400'}`}>
                                    {product.quantity}
                                </span>
                            </div>
                            <div className="w-full bg-slate-700 h-2 rounded-full mt-2 overflow-hidden">
                                <motion.div
                                    className={`h-full ${product.quantity < 10 ? 'bg-red-500' : 'bg-green-500'}`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(product.quantity, 100)}%` }}
                                />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <p className="text-center text-slate-500 text-xs mt-8">
                * Stock levels update automatically when OMS reserves items.
            </p>
        </motion.div>
    )
}
