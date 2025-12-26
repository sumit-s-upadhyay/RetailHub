import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Users, Package, LogOut } from 'lucide-react';

export default function TenantSection({ currentUser }) {
    const [activeTab, setActiveTab] = useState('staff');
    const [staffForm, setStaffForm] = useState({ username: '', password: '', role: 'STORE_STAFF' });
    const [statusMsg, setStatusMsg] = useState('');

    const handleCreateStoreStaff = async (e) => {
        e.preventDefault();
        setStatusMsg('⏳ Creating Store Staff...');
        // In a real B2B app, we would link this new user to the current Tenant's ID.
        // For MVP, we prefix the username with the store name or just create a user with a specific role.
        try {
            const url = `http://localhost:8080/api/auth/register-internal?username=${staffForm.username}&password=${staffForm.password}&role=${staffForm.role}`;
            const res = await fetch(url, { method: 'POST' });
            if (res.ok) {
                setStatusMsg(`✅ Created Staff: ${staffForm.username}`);
                setStaffForm({ ...staffForm, username: '', password: '' });
            } else {
                setStatusMsg('❌ Failed: ' + await res.text());
            }
        } catch (err) { setStatusMsg('❌ Network Error'); }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                        <Building2 className="text-indigo-500" />
                        {currentUser || 'Store'} Dashboard
                    </h2>
                    <p className="text-slate-500 mt-1">Tenant Management Console</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setActiveTab('staff')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'staff' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
                    >
                        Staff Management
                    </button>
                    <button
                        onClick={() => setActiveTab('inventory')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'inventory' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
                    >
                        My Inventory
                    </button>
                </div>
            </div>

            <div className="bg-slate-800 border border-slate-700 p-8 rounded-2xl">
                {activeTab === 'staff' && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Users className="text-indigo-400" /> Add Store Associate
                        </h3>
                        <form onSubmit={handleCreateStoreStaff} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                            <div className="space-y-1">
                                <label className="text-xs text-slate-400 uppercase font-bold">Role</label>
                                <select
                                    className="w-full bg-slate-900 border border-slate-600 text-white p-3 rounded-lg"
                                    value={staffForm.role}
                                    onChange={e => setStaffForm({ ...staffForm, role: e.target.value })}
                                >
                                    <option value="STORE_MANAGER">Inventory Manager</option>
                                    <option value="STORE_LOGISTICS">Logistics Staff</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-slate-400 uppercase font-bold">Username</label>
                                <input
                                    className="w-full bg-slate-900 border border-slate-600 text-white p-3 rounded-lg"
                                    placeholder="e.g. staff_john"
                                    value={staffForm.username}
                                    onChange={e => setStaffForm({ ...staffForm, username: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-slate-400 uppercase font-bold">Password</label>
                                <input
                                    className="w-full bg-slate-900 border border-slate-600 text-white p-3 rounded-lg"
                                    type="password"
                                    value={staffForm.password}
                                    onChange={e => setStaffForm({ ...staffForm, password: e.target.value })}
                                    required
                                />
                            </div>
                            <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg">
                                Create Account
                            </button>
                        </form>
                    </motion.div>
                )}
                {activeTab === 'inventory' && (
                    <div className="text-center py-12 text-slate-500">
                        <Package size={48} className="mx-auto mb-4 opacity-50" />
                        <p>Inventory Module accessible via Store Manager credentials.</p>
                    </div>
                )}
            </div>

            {statusMsg && (
                <div className="p-4 bg-slate-900 border border-slate-700 rounded-xl text-center font-mono text-indigo-400">
                    {statusMsg}
                </div>
            )}
        </motion.div>
    );
}
