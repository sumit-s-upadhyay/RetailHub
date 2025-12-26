import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Truck, ShoppingBag, ShieldCheck, UserPlus, Server, Activity, Database } from 'lucide-react';

export default function CrmSection() {
    const [activeTab, setActiveTab] = useState('system'); // 'system' | 'staff' | 'retailers'
    const [statusMsg, setStatusMsg] = useState('');

    // Forms
    const [staffForm, setStaffForm] = useState({ username: '', password: '', role: 'CSR' });
    const [retailerForm, setRetailerForm] = useState({ username: '', password: '' });

    // Dummy System Stats (In real app, fetch from Actuator/Metrics)
    const stats = [
        { label: 'System Status', value: 'Healthy', icon: <Activity className="text-emerald-400" />, color: 'bg-emerald-500/10 border-emerald-500/20' },
        { label: 'Active Tenants', value: '12', icon: <ShoppingBag className="text-blue-400" />, color: 'bg-blue-500/10 border-blue-500/20' },
        { label: 'DB Connections', value: '48', icon: <Database className="text-purple-400" />, color: 'bg-purple-500/10 border-purple-500/20' },
        { label: 'Uptime', value: '99.98%', icon: <Server className="text-amber-400" />, color: 'bg-amber-500/10 border-amber-500/20' },
    ];

    const handleCreateStaff = async (e) => {
        e.preventDefault();
        setStatusMsg('⏳ Creating Staff Account...');
        try {
            const url = `http://localhost:8080/api/auth/register-internal?username=${staffForm.username}&password=${staffForm.password}&role=${staffForm.role}`;
            const res = await fetch(url, { method: 'POST' });
            if (res.ok) {
                setStatusMsg(`✅ Created ${staffForm.role}: ${staffForm.username}`);
                setStaffForm({ username: '', password: '', role: 'CSR' });
            } else {
                setStatusMsg('❌ Failed: ' + await res.text());
            }
        } catch (err) { setStatusMsg('❌ Network Error'); }
    };

    const handleOnboardRetailer = async (e) => {
        e.preventDefault();
        setStatusMsg('⏳ Onboarding Retail Store...');
        try {
            // Create as TENANT_ADMIN
            const url = `http://localhost:8080/api/auth/register-internal?username=${retailerForm.username}&password=${retailerForm.password}&role=TENANT_ADMIN`;
            const res = await fetch(url, { method: 'POST' });
            if (res.ok) {
                setStatusMsg(`✅ Onboarded Retailer: ${retailerForm.username}`);
                setRetailerForm({ username: '', password: '' });
            } else {
                setStatusMsg('❌ Failed: ' + await res.text());
            }
        } catch (err) { setStatusMsg('❌ Network Error'); }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                    <ShieldCheck className="text-red-500" size={32} />
                    Platform Command Center
                </h2>
                <p className="text-slate-400 mt-2 text-lg">Centralized Administration for RetailHub PaaS</p>
            </div>

            {/* System Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`p-4 rounded-xl border ${stat.color} flex items-center justify-between`}
                    >
                        <div>
                            <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">{stat.label}</p>
                            <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                        </div>
                        <div className="p-3 bg-slate-950/30 rounded-lg backdrop-blur-sm">
                            {stat.icon}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Main Control Panel */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b border-slate-800">
                    <button
                        onClick={() => setActiveTab('retailers')}
                        className={`px-8 py-4 font-medium transition-all flex items-center gap-2 ${activeTab === 'retailers' ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/5' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                    >
                        <ShoppingBag size={18} /> Retail Partners
                    </button>
                    <button
                        onClick={() => setActiveTab('staff')}
                        className={`px-8 py-4 font-medium transition-all flex items-center gap-2 ${activeTab === 'staff' ? 'text-red-400 border-b-2 border-red-400 bg-red-500/5' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                    >
                        <Users size={18} /> Internal Staff
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 bg-slate-900/50">
                    {activeTab === 'staff' ? (
                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                            <div className="max-w-2xl">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <UserPlus className="text-red-400" /> Provision Platform Staff
                                </h3>
                                <form onSubmit={handleCreateStaff} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs text-slate-400 uppercase font-bold">Role</label>
                                            <select
                                                value={staffForm.role}
                                                onChange={e => setStaffForm({ ...staffForm, role: e.target.value })}
                                                className="w-full bg-slate-950 border border-slate-700 text-white p-3 rounded-lg focus:border-red-500 transition-colors"
                                            >
                                                <option value="CSR">CSR (Support Agent)</option>
                                                <option value="LOGISTICS">Logistics Manager</option>
                                                <option value="ADMIN">Super Admin</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs text-slate-400 uppercase font-bold">Username</label>
                                            <input
                                                className="w-full bg-slate-950 border border-slate-700 text-white p-3 rounded-lg focus:border-red-500 transition-colors"
                                                placeholder="e.g. support_agent_01"
                                                value={staffForm.username}
                                                onChange={e => setStaffForm({ ...staffForm, username: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-slate-400 uppercase font-bold">Password</label>
                                        <input
                                            className="w-full bg-slate-950 border border-slate-700 text-white p-3 rounded-lg focus:border-red-500 transition-colors"
                                            type="password"
                                            placeholder="Set secure password"
                                            value={staffForm.password}
                                            onChange={e => setStaffForm({ ...staffForm, password: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <button className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3.5 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-red-900/20 transition-all">
                                        <UserPlus size={18} /> Create Staff Account
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    ) : activeTab === 'retailers' ? (
                        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                            <div className="max-w-2xl">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <Truck className="text-blue-400" /> Onboard Retail Tenant
                                </h3>
                                <div className="bg-blue-500/5 border border-blue-500/10 p-4 rounded-lg mb-6 text-sm text-blue-200">
                                    Creating a Tenant Admin account will automatically provision a new Store Profile and isolated environment for the partner.
                                </div>
                                <form onSubmit={handleOnboardRetailer} className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-xs text-slate-400 uppercase font-bold">Store Identifier (Tenant ID)</label>
                                        <input
                                            className="w-full bg-slate-950 border border-slate-700 text-white p-3 rounded-lg focus:border-blue-500 transition-colors"
                                            placeholder="e.g. target_seattle_04"
                                            value={retailerForm.username}
                                            onChange={e => setRetailerForm({ ...retailerForm, username: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-slate-400 uppercase font-bold">Initial Admin Password</label>
                                        <input
                                            className="w-full bg-slate-950 border border-slate-700 text-white p-3 rounded-lg focus:border-blue-500 transition-colors"
                                            type="password"
                                            placeholder="••••••••"
                                            value={retailerForm.password}
                                            onChange={e => setRetailerForm({ ...retailerForm, password: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 transition-all">
                                        <Truck size={18} /> Provision Store Tenant
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="text-slate-500 text-center py-10">Select a tab to manage settings.</div>
                    )}
                </div>
            </div>

            {statusMsg && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-slate-800 border-l-4 border-emerald-500 text-white rounded-r-lg shadow-lg flex items-center gap-3"
                >
                    <Activity size={20} className="text-emerald-400" />
                    <span className="font-mono text-sm">{statusMsg}</span>
                </motion.div>
            )}
        </motion.div>
    );
}
