import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Building2, User, ShoppingBag, ArrowRight, X } from 'lucide-react';

export default function LoginSection() {
    const [selectedPortal, setSelectedPortal] = useState(null); // 'ADMIN', 'PARTNER', 'STAFF', 'CUSTOMER'

    // Portal Configurations
    const portals = [
        {
            id: 'ADMIN',
            title: 'Platform Admin',
            desc: 'System & Tenant Management',
            icon: <ShieldCheck size={32} />,
            color: 'from-red-500 to-rose-600',
            borderColor: 'border-red-500/50',
            bgHover: 'hover:bg-red-950/30'
        },
        {
            id: 'PARTNER',
            title: 'Partner Portal',
            desc: 'Store Owners & Management',
            icon: <Building2 size={32} />,
            color: 'from-blue-500 to-indigo-600',
            borderColor: 'border-blue-500/50',
            bgHover: 'hover:bg-blue-950/30'
        },
        {
            id: 'STAFF',
            title: 'Workforce Portal',
            desc: 'Logistics & Inventory Ops',
            icon: <User size={32} />,
            color: 'from-emerald-500 to-teal-600',
            borderColor: 'border-emerald-500/50',
            bgHover: 'hover:bg-emerald-950/30'
        },
        {
            id: 'CUSTOMER',
            title: 'Customer Login',
            desc: 'Shop & Track Orders',
            icon: <ShoppingBag size={32} />,
            color: 'from-amber-500 to-orange-600',
            borderColor: 'border-amber-500/50',
            bgHover: 'hover:bg-amber-950/30'
        }
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
            </div>

            <div className="z-10 w-full max-w-6xl">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        RetailHub <span className="text-2xl font-light opacity-70">Enterprise</span>
                    </h1>
                    <p className="text-slate-400 text-lg">Select your secure gateway to proceed</p>
                </div>

                {/* Portal Selection Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {portals.map((portal) => (
                        <motion.button
                            key={portal.id}
                            whileHover={{ y: -5, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedPortal(portal.id)}
                            className={`relative group p-8 rounded-2xl border ${portal.borderColor} bg-slate-900/50 backdrop-blur-sm ${portal.bgHover} transition-all duration-300 text-left border-opacity-30 hover:border-opacity-80`}
                        >
                            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${portal.color} flex items-center justify-center mb-6 shadow-lg`}>
                                {portal.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-white group-hover:text-white/90 transition-colors">
                                {portal.title}
                            </h3>
                            <p className="text-sm text-slate-400 group-hover:text-slate-300 leading-relaxed">
                                {portal.desc}
                            </p>
                            <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1">
                                <ArrowRight className="text-white/70" />
                            </div>
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Login Modal Overlay */}
            <AnimatePresence>
                {selectedPortal && (
                    <LoginModal
                        portalId={selectedPortal}
                        config={portals.find(p => p.id === selectedPortal)}
                        onClose={() => setSelectedPortal(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

// Inner Component: Specific Login Form
function LoginModal({ portalId, config, onClose }) {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Simulate API call delay for effect
        await new Promise(r => setTimeout(r, 600));

        try {
            const res = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (res.ok) {
                const data = await res.json(); // Expected { token, user: { role, ... } }

                // IMPORTANT: Validate Role matches Portal
                const userRole = data.user.role;
                let allowed = false;

                if (portalId === 'ADMIN' && (userRole === 'ADMIN' || userRole === 'ROLE_ADMIN')) allowed = true;
                if (portalId === 'PARTNER' && (userRole === 'TENANT_ADMIN' || userRole === 'ROLE_TENANT_ADMIN')) allowed = true;
                if (portalId === 'STAFF' && ['CSR', 'LOGISTICS', 'STORE_MANAGER', 'STORE_LOGISTICS', 'ROLE_CSR', 'ROLE_LOGISTICS'].includes(userRole)) allowed = true;
                if (portalId === 'CUSTOMER' && (userRole === 'CUSTOMER' || userRole === 'ROLE_CUSTOMER')) allowed = true;

                if (allowed) {
                    login(data.token, data.user);
                } else {
                    setError(`❌ Access Denied: This account cannot access the ${config.title}`);
                }
            } else {
                setError('❌ Invalid Credentials');
            }
        } catch (err) {
            setError('❌ System Offline');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative"
            >
                {/* Header */}
                <div className={`p-8 bg-gradient-to-r ${config.color}`}>
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                        <X size={16} />
                    </button>
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm border border-white/20">
                        {config.icon}
                    </div>
                    <h2 className="text-2xl font-bold">{config.title} login</h2>
                    <p className="text-white/80 text-sm mt-1">Authorized Personnel Only</p>
                </div>

                {/* Form */}
                <div className="p-8 space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Username / ID</label>
                            <input
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/20 transition-colors"
                                value={username} onChange={e => setUsername(e.target.value)}
                                autoFocus
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
                            <input
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/20 transition-colors"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center font-medium">
                                {error}
                            </div>
                        )}

                        <button
                            disabled={loading}
                            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg bg-gradient-to-r ${config.color} hover:opacity-90 transition-opacity flex items-center justify-center gap-2`}
                        >
                            {loading ? (
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <><span>Access Portal</span> <ArrowRight size={18} /></>
                            )}
                        </button>
                    </form>

                    {/* Demo Hints */}
                    <div className="pt-6 border-t border-slate-800 text-center">
                        <p className="text-xs text-slate-500 mb-2">Demo Credentials:</p>
                        <code className="px-2 py-1 bg-slate-950 rounded text-xs text-slate-400 font-mono">
                            {portalId === 'ADMIN' ? 'admin / admin123' :
                                portalId === 'PARTNER' ? 'walmart_hq / secret' :
                                    portalId === 'STAFF' ? 'csr / csr123' : 'john_doe / password'}
                        </code>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
