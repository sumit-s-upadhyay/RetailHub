import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, UserPlus, Users, Lock, LogOut } from 'lucide-react';

export default function CrmSection() {
    // Auth State
    const [userRole, setUserRole] = useState(null); // 'ADMIN', 'CSR' or null
    const [credentials, setCredentials] = useState({ username: '', password: '' });

    // Form States
    const [csrForm, setCsrForm] = useState({ username: '', password: '' });
    const [custForm, setCustForm] = useState({ name: '', email: '' });

    // Logs
    const [statusMsg, setStatusMsg] = useState('');

    const login = (role) => {
        setStatusMsg('');
        if (role === 'ADMIN') {
            setCredentials({ username: 'admin', password: 'admin123' });
            setUserRole('ADMIN');
        } else if (role === 'CSR') {
            setCredentials({ username: 'csr1', password: 'csr123' });
            setUserRole('CSR');
        }
    };

    const logout = () => {
        setUserRole(null);
        setCredentials({ username: '', password: '' });
        setStatusMsg('');
    };

    // API ACTION: Create CSR (Admin Only)
    const handleCreateCsr = async (e) => {
        e.preventDefault();
        setStatusMsg('⏳ Creating CSR Profile...');

        try {
            const authHeader = 'Basic ' + btoa(`${credentials.username}:${credentials.password}`);
            const url = `http://localhost:8081/api/admin/create-csr?username=${csrForm.username}&password=${csrForm.password}`;

            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Authorization': authHeader }
            });

            if (res.ok) {
                const text = await res.text();
                setStatusMsg('✅ ' + text);
                setCsrForm({ username: '', password: '' });
            } else {
                setStatusMsg('❌ Access Denied: ' + res.status);
            }
        } catch (err) {
            setStatusMsg('❌ Network Error: Is CRM running?');
        }
    };

    // API ACTION: Onboard Customer (CSR Only)
    const handleOnboardCustomer = async (e) => {
        e.preventDefault();
        setStatusMsg('⏳ Onboarding Customer...');

        try {
            const authHeader = 'Basic ' + btoa(`${credentials.username}:${credentials.password}`);
            const url = `http://localhost:8081/api/csr/onboard-customer?name=${custForm.name}&email=${custForm.email}`;

            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Authorization': authHeader }
            });

            if (res.ok) {
                const text = await res.text();
                setStatusMsg('✅ ' + text);
                setCustForm({ name: '', email: '' });
            } else {
                setStatusMsg('❌ Access Denied: ' + res.status);
            }
        } catch (err) {
            setStatusMsg('❌ Network Error: Is CRM running?');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
        >
            <div className="flex justify-between items-center bg-slate-800 p-6 rounded-xl border border-slate-700">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Users className="text-blue-400" />
                        CRM Secure Portal
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">Role-Based Access Control (RBAC) System</p>
                </div>

                {userRole ? (
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <div className="text-xs text-slate-400">Logged in as</div>
                            <div className={`font-bold ${userRole === 'ADMIN' ? 'text-red-400' : 'text-green-400'}`}>
                                {userRole}
                            </div>
                        </div>
                        <button onClick={logout} className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors">
                            <LogOut size={20} />
                        </button>
                    </div>
                ) : (
                    <div className="flex gap-3">
                        <button
                            onClick={() => login('ADMIN')}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/50 hover:bg-red-500/20 rounded-lg transition-all"
                        >
                            <Shield size={16} /> Admin Login
                        </button>
                        <button
                            onClick={() => login('CSR')}
                            className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-400 border border-green-500/50 hover:bg-green-500/20 rounded-lg transition-all"
                        >
                            <UserPlus size={16} /> CSR Login
                        </button>
                    </div>
                )}
            </div>

            <AnimatePresence mode="wait">
                {userRole === 'ADMIN' && (
                    <motion.div
                        key="admin-panel"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-red-500/5 border border-red-500/20 p-8 rounded-xl"
                    >
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Lock size={20} className="text-red-400" />
                            Admin Console: Create Agent
                        </h3>
                        <form onSubmit={handleCreateCsr} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input
                                type="text"
                                placeholder="New Agent Username"
                                value={csrForm.username}
                                onChange={e => setCsrForm({ ...csrForm, username: e.target.value })}
                                className="bg-slate-900 border border-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-red-500"
                                required
                            />
                            <input
                                type="password"
                                placeholder="Set Password"
                                value={csrForm.password}
                                onChange={e => setCsrForm({ ...csrForm, password: e.target.value })}
                                className="bg-slate-900 border border-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-red-500"
                                required
                            />
                            <button className="bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-lg transition-colors">
                                Create CSR Agent
                            </button>
                        </form>
                    </motion.div>
                )}

                {userRole === 'CSR' && (
                    <motion.div
                        key="csr-panel"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-green-500/5 border border-green-500/20 p-8 rounded-xl"
                    >
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <UserPlus size={20} className="text-green-400" />
                            CSR Workspace: Customer Onboarding
                        </h3>
                        <form onSubmit={handleOnboardCustomer} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input
                                type="text"
                                placeholder="Customer Full Name"
                                value={custForm.name}
                                onChange={e => setCustForm({ ...custForm, name: e.target.value })}
                                className="bg-slate-900 border border-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-green-500"
                                required
                            />
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={custForm.email}
                                onChange={e => setCustForm({ ...custForm, email: e.target.value })}
                                className="bg-slate-900 border border-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-green-500"
                                required
                            />
                            <button className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-lg transition-colors">
                                Onboard Customer
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Status Output */}
            {statusMsg && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 bg-slate-900 border border-slate-700 rounded-lg text-sm font-mono text-blue-300"
                >
                    {statusMsg}
                </motion.div>
            )}

            {/* Hint Box */}
            <div className="mt-8 p-4 bg-slate-800/50 rounded-lg text-xs text-slate-500">
                <p className="font-bold mb-1">Testing Credentials (Pre-loaded):</p>
                <div className="grid grid-cols-2 gap-4">
                    <div>ADMIN: <span className="text-slate-400">admin / admin123</span></div>
                    <div>CSR: <span className="text-slate-400">csr1 / csr123</span></div>
                </div>
            </div>
        </motion.div>
    )
}
