/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LiveTracker } from './components/LiveTracker';
import { Dashboard } from './components/Dashboard';
import { Activity, LayoutDashboard } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'tracker' | 'dashboard'>('tracker');

  return (
    <div 
      className="min-h-screen text-white font-sans selection:bg-blue-500/30 flex flex-col overflow-hidden"
      style={{
        backgroundColor: '#0c0d12',
        backgroundImage: 'radial-gradient(circle at 0% 0%, #1a1c2e 0%, transparent 50%), radial-gradient(circle at 100% 100%, #1a1c2e 0%, transparent 50%), radial-gradient(circle at 50% 50%, #0c0d12 0%, #141625 100%)'
      }}
    >
      <header className="h-16 px-4 md:px-8 flex items-center justify-between backdrop-blur-md bg-white/5 border-b border-white/10 shrink-0 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto w-full h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
              <Activity size={18} className="text-white" />
            </div>
            <h1 className="font-bold text-xl tracking-tight">EmotionTracker</h1>
          </div>
          
          <div className="flex p-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl">
            <button
              onClick={() => setActiveTab('tracker')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'tracker' 
                  ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Activity size={16} />
              <span>Live Tracker</span>
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'dashboard' 
                  ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <LayoutDashboard size={16} />
              <span>Dashboard</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-6xl mx-auto w-full">
          {activeTab === 'tracker' ? <LiveTracker /> : <Dashboard />}
        </div>
      </main>
    </div>
  );
}

