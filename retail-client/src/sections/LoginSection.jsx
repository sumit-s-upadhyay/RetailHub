import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, ArrowRight, Loader2 } from 'lucide-react';

export default function LoginSection({ onLogin }) {
    const [isRegister, setIsRegister] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const endpoint = isRegister ? '/register' : '/login';
        const url = `http://localhost:8081/api/auth${endpoint}?username=${username}&password=${password}`;

        try {
            const res = await fetch(url, { method: 'POST' });

            if (!res.ok) {
                const errorText = await res.text();
                // Check specifically for "User already exists" exception from backend
                if (errorText.includes("User already exists")) {
                    throw new Error("User already exists! Switching to Login...");
                } else if (res.status === 403 || res.status === 401) {
                    throw new Error("Invalid username or password.");
                } else {
                    // Fallback for other server errors
                    throw new Error("Login failed. (" + res.status + ")");
                }
            }

            const user = await res.json();

            if (user && user.role) {
                let appRole = 'customer';
                if (user.role === 'ROLE_ADMIN' || user.role === 'ROLE_CSR') appRole = 'csr';
                if (user.role === 'ROLE_LOGISTICS') appRole = 'shipping';
                if (user.role === 'CUSTOMER') appRole = 'customer';

                onLogin(appRole, user.username);
            }
        } catch (err) {
            setError(err.message);
            // UX Enhancement: If they try to register an existing user, send them to login
            if (err.message.includes("User already exists")) {
                setTimeout(() => {
                    setIsRegister(false);
                    setError(null);
                }, 1500);
            }
        } finally {
            setLoading(false);
        }
    };

    const quickLogin = (role) => {
        onLogin(role, role.toUpperCase() + "_USER");
    };

    return (
        <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto w-full px-6">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">RetailHub Access</h1>
                <p className="text-slate-400">Secure Enterprise Gateway</p>
            </div>

            <motion.div
                layout
                className="bg-slate-800 border border-slate-700 p-8 rounded-2xl w-full shadow-2xl"
            >
                <div className="flex justify-center mb-6 border-b border-slate-700 pb-4">
                    <button
                        onClick={() => setIsRegister(false)}
                        className={`px-4 py-2 font-bold ${!isRegister ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-500'}`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => setIsRegister(true)}
                        className={`px-4 py-2 font-bold ${isRegister ? 'text-pink-400 border-b-2 border-pink-400' : 'text-slate-500'}`}
                    >
                        Register
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Username</label>
                        <div className="flex items-center bg-slate-900 rounded-lg px-3 border border-slate-700 focus-within:border-blue-500 transition-colors">
                            <User size={18} className="text-slate-400" />
                            <input
                                type="text"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                className="bg-transparent w-full p-3 outline-none text-white placeholder-slate-600"
                                placeholder="Enter your ID"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Password</label>
                        <div className="flex items-center bg-slate-900 rounded-lg px-3 border border-slate-700 focus-within:border-blue-500 transition-colors">
                            <Lock size={18} className="text-slate-400" />
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="bg-transparent w-full p-3 outline-none text-white placeholder-slate-600"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    {error && <div className="text-red-400 text-sm font-bold animate-pulse">{error}</div>}

                    <button
                        disabled={loading}
                        className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all ${isRegister ? 'bg-pink-600 hover:bg-pink-500' : 'bg-blue-600 hover:bg-blue-500'
                            }`}
                    >
                        {loading && <Loader2 className="animate-spin" />}
                        {isRegister ? 'Create Account' : 'Sign In'} <ArrowRight size={18} />
                    </button>
                </form>
            </motion.div>

            {/* Quick Links for Demo Staff */}
            <div className="mt-8 flex gap-4 text-sm text-slate-500">
                <span>Staff Access:</span>
                <button onClick={() => quickLogin('csr')} className="hover:text-white underline">CSR Agent</button>
                <button onClick={() => quickLogin('shipping')} className="hover:text-white underline">Logistics</button>
            </div>
        </div>
    )
}
