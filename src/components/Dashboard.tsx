import React, { useEffect, useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, Cell
} from 'recharts';
import { getLogs, clearLogs } from '../store';
import { EmotionLog } from '../types';
import { Trash2 } from 'lucide-react';

const COLORS: Record<string, string> = {
  neutral: '#94a3b8',
  happy: '#4ade80',
  sad: '#60a5fa',
  angry: '#f87171',
  fearful: '#a78bfa',
  disgusted: '#fbbf24',
  surprised: '#fb923c'
};

export function Dashboard() {
  const [logs, setLogs] = useState<EmotionLog[]>([]);

  useEffect(() => {
    setLogs(getLogs().sort((a, b) => a.timestamp - b.timestamp));
  }, []);

  const handleClear = () => {
    if (confirm('Are you sure you want to clear all logs?')) {
      clearLogs();
      setLogs([]);
    }
  };

  // Format data for timeline
  const timelineData = logs.map(log => {
    const date = new Date(log.timestamp);
    const result: any = {
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: date.toLocaleDateString(),
      dominant: log.emotion,
    };
    
    // Add all expressions for stacked area
    Object.entries(log.expressions || {}).forEach(([emotion, value]) => {
      result[emotion] = Math.round((value as number) * 100);
    });
    
    return result;
  });

  // Calculate emotion distribution
  const distributionMap = logs.reduce((acc, log) => {
    acc[log.emotion] = (acc[log.emotion] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const distributionData = Object.entries(distributionMap).map(([emotion, count]) => ({
    name: emotion,
    count: count as number
  })).sort((a, b) => b.count - a.count);

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
        <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-gray-400 text-3xl shadow-[0_0_15px_rgba(255,255,255,0.05)]">
          📊
        </div>
        <div>
          <h3 className="text-lg font-medium text-white">No data yet</h3>
          <p className="text-gray-400">Go to the Live Tracker and log some emotions first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto w-full space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Mood Dashboard</h2>
          <p className="text-gray-400">Visualizing your emotional trends over time.</p>
        </div>
        <button 
          onClick={handleClear}
          className="flex items-center space-x-2 text-sm text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-4 py-2 rounded-lg transition-colors"
        >
          <Trash2 size={16} />
          <span>Clear Data</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 lg:col-span-2 backdrop-blur-xl bg-white/5 p-6 rounded-3xl border border-white/10 shadow-xl">
          <h3 className="text-lg font-semibold mb-6 text-white">Emotion Timeline</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  {Object.entries(COLORS).map(([key, color]) => (
                    <linearGradient key={key} id={`color${key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={color} stopOpacity={0.1}/>
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="time" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#94a3b8' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#94a3b8' }} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.3)', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                {Object.keys(COLORS).map(emotion => (
                  <Area 
                    key={emotion}
                    type="monotone" 
                    dataKey={emotion} 
                    stackId="1" 
                    stroke={COLORS[emotion]} 
                    fill={`url(#color${emotion})`} 
                    name={emotion.charAt(0).toUpperCase() + emotion.slice(1)}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-1 backdrop-blur-xl bg-white/5 p-6 rounded-3xl border border-white/10 shadow-xl flex flex-col">
          <h3 className="text-lg font-semibold mb-6 text-white">Dominant Emotion Distribution</h3>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distributionData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" hide />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#94a3b8', textTransform: 'capitalize' }} 
                  width={80}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.3)', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {
                    distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#cbd5e1'} />
                    ))
                  }
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 bg-white/5">
          <h3 className="text-lg font-semibold text-white">Recent Logs</h3>
        </div>
        <div className="divide-y divide-white/10">
          {logs.slice().reverse().slice(0, 10).map(log => (
            <div key={log.id} className="p-4 px-6 flex items-center justify-between hover:bg-white/5 transition-colors">
              <div className="flex items-center space-x-4">
                <div 
                  className="w-3 h-3 rounded-full shadow-[0_0_8px_currentColor]" 
                  style={{ backgroundColor: COLORS[log.emotion] || '#cbd5e1', color: COLORS[log.emotion] || '#cbd5e1' }}
                />
                <div>
                  <p className="font-medium capitalize text-white">{log.emotion}</p>
                  <p className="text-xs text-gray-400">
                    Confidence: {Math.round(log.confidence * 100)}%
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-white">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </p>
                <p className="text-xs text-gray-400 font-mono">
                  {new Date(log.timestamp).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
