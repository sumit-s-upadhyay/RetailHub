import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

export default function CartDrawer({ isOpen, onClose, cart, onCheckout, isCheckingOut }) {
    const total = cart.length * 999.00;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl z-50 flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <ShoppingBag className="text-pink-500" />
                                Your Cart <span className="bg-slate-800 text-sm px-2 py-0.5 rounded-full text-zinc-400">{cart.length}</span>
                            </h2>
                            <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
                                    <ShoppingBag size={48} className="opacity-20" />
                                    <p>Your cart is empty</p>
                                    <button onClick={onClose} className="text-pink-400 hover:underline text-sm">Start Shopping</button>
                                </div>
                            ) : (
                                cart.map((item, idx) => (
                                    <motion.div
                                        key={`${item.sku}-${idx}`}
                                        layout
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 flex gap-4"
                                    >
                                        <div className="w-16 h-16 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0 text-slate-600">
                                            <ShoppingBag size={24} />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-white text-sm line-clamp-1">{item.name}</h4>
                                            <p className="text-xs text-slate-500 font-mono mt-1">{item.sku}</p>
                                            <div className="mt-2 text-pink-400 font-bold text-sm">$999.00</div>
                                        </div>
                                        <button className="text-slate-600 hover:text-red-400 self-start p-1">
                                            <Trash2 size={16} />
                                        </button>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-6 bg-slate-900 border-t border-slate-800 space-y-4">
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between text-slate-400">
                                    <span>Subtotal</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-slate-400">
                                    <span>Shipping</span>
                                    <span className="text-green-400">Free</span>
                                </div>
                                <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-slate-800">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={onCheckout}
                                disabled={cart.length === 0 || isCheckingOut}
                                className="w-full py-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white rounded-xl font-bold shadow-lg shadow-pink-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
                            >
                                {isCheckingOut ? (
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Checkout Now <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
