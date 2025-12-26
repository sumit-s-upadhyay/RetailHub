import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function OmsSection() {
    const [logs, setLogs] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderState, setOrderState] = useState('CREATED');

    const states = ['CREATED', 'PAID', 'SHIPPED', 'DELIVERED'];
    const currentIndex = states.indexOf(orderState);

    const addLog = (msg, color = 'border-slate-500 text-slate-300') => {
        setLogs(prev => [...prev, { msg, color }]);
    };

    const advanceState = async () => {
        if (currentIndex >= states.length - 1) return;

        // Simulate Orchestration Logic based on current state
        if (orderState === 'CREATED') {
            setIsProcessing(true);
            addLog("[OMS] Order Placed. Sending trigger to Backend...", "border-blue-500 text-blue-300");

            // REAL BACKEND CALL
            try {
                await fetch('http://localhost:8080/api/oms/next', { method: 'POST' });
                addLog("   -> Backend Processing Started (Watch Server Logs)...", "border-purple-500 text-purple-300");
            } catch (e) {
                addLog("   ❌ Backend Connection Failed (Ensure OMS is running)", "border-red-500 text-red-300");
            }

            // Visual Simulation continues for UX smoothly
            await new Promise(r => setTimeout(r, 2000));
            addLog("   <- [Backend] Orchestration Complete.", "border-green-500 text-green-300");

            setOrderState(states[currentIndex + 1]);
            setIsProcessing(false);
        } else if (orderState === 'PAID') {
            setIsProcessing(true);
            addLog("[OMS] Payment Confirmed. Preparing Shipping...", "border-blue-500 text-blue-300");
            await new Promise(r => setTimeout(r, 1000));
            addLog("   -> Generating Label via FedEx API...", "border-orange-500 text-orange-300");
            setOrderState(states[currentIndex + 1]);
            setIsProcessing(false);
        } else {
            setOrderState(states[currentIndex + 1]);
            addLog("[OMS] Order Delivered. Case Closed.", "border-slate-500 text-slate-500");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
        >
            <h2 className="text-2xl font-bold text-white">Order Management (OMS)</h2>

            {/* State Pattern & Orchestration Visualization */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Left: Interactive Controls */}
                <div className="bg-slate-800 p-8 rounded-xl border border-slate-700">
                    <h3 className="text-lg font-semibold text-white mb-6">Order Lifecycle Controls</h3>

                    <div className="flex flex-col space-y-8">
                        {/* Progress Bar */}
                        <div className="relative">
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-700 -z-0"></div>
                            <motion.div
                                className="absolute top-1/2 left-0 h-1 bg-blue-500 -z-0"
                                initial={{ width: '0%' }}
                                animate={{ width: `${(currentIndex / (states.length - 1)) * 100}%` }}
                            ></motion.div>
                            <div className="flex justify-between relative z-10">
                                {states.map((state, idx) => {
                                    const isCompleted = idx <= currentIndex;
                                    const isCurrent = idx === currentIndex;
                                    return (
                                        <div key={state} className="flex flex-col items-center bg-slate-800 px-2">
                                            <motion.div
                                                className={`w-6 h-6 rounded-full flex items-center justify-center border-2 
                                                    ${isCompleted ? 'bg-blue-600 border-blue-600' : 'bg-slate-800 border-slate-600'}`}
                                                animate={{ scale: isCurrent ? 1.2 : 1 }}
                                            >
                                                {isCompleted && <span className="text-white text-[10px]">✓</span>}
                                            </motion.div>
                                            <span className={`mt-2 text-[10px] font-semibold ${isCompleted ? 'text-blue-300' : 'text-slate-500'}`}>
                                                {state}
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-slate-400">Context State:</span>
                                <span className="text-orange-400 font-mono">{orderState}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Next Action:</span>
                                <span className="text-white">
                                    {orderState === 'CREATED' ? 'Trigger Payment & Inventory' :
                                        orderState === 'PAID' ? 'Ship Order' : 'Complete Delivery'}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={advanceState}
                            disabled={currentIndex === states.length - 1 || isProcessing}
                            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed w-full py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-900/20 transition-all"
                        >
                            {isProcessing ? 'Processing Microservices...' : 'Next State Trigger'}
                        </button>
                    </div>
                </div>

                {/* Right: System Console Logs */}
                <div className="bg-black rounded-xl border border-slate-800 overflow-hidden flex flex-col h-[400px]">
                    <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="ml-2 text-xs text-slate-400 font-mono">system-orchestrator.log</span>
                    </div>
                    <div className="p-4 font-mono text-xs overflow-y-auto flex-1 space-y-2">
                        {logs.length === 0 && <span className="text-slate-600 italic">Waiting for events...</span>}
                        {logs.map((log, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`border-l-2 pl-2 ${log.color}`}
                            >
                                <span className="mr-2 opacity-50">[{new Date().toLocaleTimeString()}]</span>
                                {log.msg}
                            </motion.div>
                        ))}
                    </div>
                </div>

            </div>
        </motion.div>
    )
}
