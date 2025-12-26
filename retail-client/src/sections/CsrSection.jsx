import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, RefreshCw, Plus, Edit } from 'lucide-react';

export default function CsrSection({ currentUser }) {
    const [products, setProducts] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({ sku: '', name: '', quantity: 10 });

    const fetchProducts = async () => {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:8080/api/inventory/products', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        setProducts(await res.json());
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleUpdateStock = async (sku, newQty) => {
        const product = products.find(p => p.sku === sku);
        const token = localStorage.getItem('token');
        await fetch(`http://localhost:8080/api/inventory/products/${sku}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ ...product, quantity: parseInt(newQty) })
        });
        fetchProducts();
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        await fetch('http://localhost:8080/api/inventory/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });
        setShowAddForm(false);
        fetchProducts();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-indigo-900/50 p-6 rounded-2xl border border-indigo-700">
                <div>
                    <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                        <Package className="text-indigo-400" />
                        Inventory Manager (CSR)
                    </h2>
                    <p className="text-indigo-200 mt-1">Manage Catalog & Stock</p>
                </div>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-bold flex gap-2 items-center"
                >
                    <Plus size={18} /> New Product
                </button>
            </div>

            {showAddForm && (
                <motion.form
                    initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-800 p-6 rounded-xl border border-slate-700 space-y-4"
                    onSubmit={handleAddProduct}
                >
                    <h3 className="text-white font-bold">Add New Product</h3>
                    <div className="grid grid-cols-3 gap-4">
                        <input placeholder="SKU" className="p-2 bg-slate-900 text-white rounded" required
                            onChange={e => setFormData({ ...formData, sku: e.target.value })} />
                        <input placeholder="Name" className="p-2 bg-slate-900 text-white rounded" required
                            onChange={e => setFormData({ ...formData, name: e.target.value })} />
                        <input type="number" placeholder="Qty" className="p-2 bg-slate-900 text-white rounded" required
                            onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) })} />
                    </div>
                    <button type="submit" className="w-full bg-green-600 hover:bg-green-500 text-white p-2 rounded font-bold">Save Product</button>
                </motion.form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map(p => (
                    <div key={p.sku} className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col gap-2">
                        <div className="flex justify-between">
                            <span className="font-bold text-white">{p.name}</span>
                            <span className="text-xs font-mono text-slate-500">{p.sku}</span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                            <span className="text-slate-400 text-sm">Stock: {p.quantity}</span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleUpdateStock(p.sku, p.quantity + 10)}
                                    className="p-1 bg-slate-700 text-green-400 rounded hover:bg-slate-600 title='Add 10'"
                                >
                                    <Plus size={16} />
                                </button>
                                <button
                                    onClick={() => handleUpdateStock(p.sku, 0)}
                                    className="p-1 bg-slate-700 text-red-400 rounded hover:bg-slate-600 title='Clear Stock'"
                                >
                                    <RefreshCw size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
