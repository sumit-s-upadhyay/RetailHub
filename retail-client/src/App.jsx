import React, { useState } from 'react';
import LoginSection from './sections/LoginSection';
import CsrDashboard from './sections/CsrDashboard';
import ShippingDashboard from './sections/ShippingDashboard';
import StorefrontSection from './sections/StorefrontSection';
import InventorySection from './sections/InventorySection';
import { Home, LogOut, Package } from 'lucide-react';

function App() {
    const [userRole, setUserRole] = useState(null); // 'customer', 'csr', 'shipping'
    const [userName, setUserName] = useState(null);
    const [activeTab, setActiveTab] = useState('home');

    const handleLogin = (role, username) => {
        setUserRole(role);
        setUserName(username);
        setActiveTab('home');
    };

    const handleLogout = () => {
        setUserRole(null);
        setUserName(null);
    };

    // --- RENDER LOGIC ---
    const renderContent = () => {
        if (!userRole) return <LoginSection onLogin={handleLogin} />;

        if (userRole === 'customer') {
            return <StorefrontSection currentUser={userName} />;
        }

        if (userRole === 'csr') {
            return activeTab === 'home' ? <CsrDashboard /> : <InventorySection />;
        }

        if (userRole === 'shipping') {
            return <ShippingDashboard />;
        }
    };

    if (!userRole) {
        return (
            <div className="h-screen bg-slate-950 flex items-center justify-center p-8">
                <LoginSection onLogin={handleLogin} />
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-slate-950 text-slate-200 font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
                <div className="p-6 border-b border-slate-800">
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                        RetailHub
                    </span>
                    <div className="mt-2 text-xs font-mono text-slate-500 uppercase tracking-widest">{userRole} Portal</div>
                    {userName && <div className="text-xs text-slate-600 mt-1">user: {userName}</div>}
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <SidebarItem icon={<Home size={20} />} label="V Workspace" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />

                    {userRole === 'csr' && (
                        <SidebarItem icon={<Package size={20} />} label="Live Inventory" active={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} />
                    )}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 w-full text-slate-400 hover:text-white hover:bg-red-500/10 rounded-lg transition-colors">
                        <LogOut size={16} />
                        <span className="text-sm font-medium">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8 relative">
                <div className="max-w-6xl mx-auto">
                    {renderContent()}
                </div>
            </main>
        </div>
    )
}

function SidebarItem({ icon, label, active, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-all ${active ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-400 hover:bg-slate-800'
                }`}
        >
            {icon}
            <span className="font-medium">{label}</span>
        </button>
    )
}

export default App;
