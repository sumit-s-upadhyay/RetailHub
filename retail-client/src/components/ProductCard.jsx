import React from 'react';
import { motion } from 'framer-motion';
import { Package, Plus, Star, Eye } from 'lucide-react';

export default function ProductCard({ product, onAdd, onViewDetails }) {
    const isOutOfStock = product.quantity === 0;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="group relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:border-pink-500/30 transition-all duration-300 flex flex-col h-full"
        >
            {/* Image Placeholder Area */}
            <div className="relative h-48 bg-gradient-to-b from-slate-800 to-slate-900 group-hover:from-slate-800 group-hover:to-slate-800 transition-colors flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://source.unsplash.com/random/400x400/?gadget')] opacity-20 mix-blend-overlay bg-cover bg-center" />

                <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <Package size={64} className="text-slate-600 group-hover:text-pink-400/80 transition-colors" />
                </motion.div>

                {/* Badges */}
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                    <span className="bg-slate-950/80 backdrop-blur text-xs font-mono text-slate-400 px-2 py-1 rounded-md border border-slate-800">
                        {product.sku}
                    </span>
                    {isOutOfStock && (
                        <span className="bg-red-500/90 text-white text-xs font-bold px-2 py-1 rounded-md shadow-md">
                            SOLD OUT
                        </span>
                    )}
                </div>
            </div>

            {/* Content Area */}
            <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-white group-hover:text-pink-400 transition-colors line-clamp-2">
                        {product.name}
                    </h3>
                </div>

                <div className="flex items-center gap-1 mb-4">
                    <Star size={14} className="text-yellow-500 fill-yellow-500" />
                    <Star size={14} className="text-yellow-500 fill-yellow-500" />
                    <Star size={14} className="text-yellow-500 fill-yellow-500" />
                    <Star size={14} className="text-yellow-500 fill-yellow-500" />
                    <Star size={14} className="text-slate-600" />
                    <span className="text-xs text-slate-500 ml-1">(12 reviews)</span>
                </div>

                <div className="mt-auto space-y-4">
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-xs text-slate-500 mb-0.5">Price</p>
                            <p className="text-2xl font-bold text-white">$999.00</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-slate-500 mb-0.5">Stock</p>
                            <p className={`font-mono font-medium ${isOutOfStock ? 'text-red-400' : 'text-emerald-400'}`}>
                                {product.quantity} units
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => onViewDetails(product)}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-sm font-medium transition-colors"
                        >
                            <Eye size={16} /> Details
                        </button>
                        <button
                            onClick={() => onAdd(product)}
                            disabled={isOutOfStock}
                            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg transition-all
                                ${isOutOfStock
                                    ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white hover:shadow-pink-500/25 transform hover:-translate-y-0.5'
                                }`}
                        >
                            <Plus size={16} /> Add
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
