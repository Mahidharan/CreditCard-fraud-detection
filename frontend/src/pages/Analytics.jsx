import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, ZAxis
} from 'recharts';

const Analytics = () => {
  // Mock data for analytics
  const timeSeriesData = [
    { time: '00:00', amount: 400, fraudRisk: 0.1 },
    { time: '04:00', amount: 300, fraudRisk: 0.2 },
    { time: '08:00', amount: 1200, fraudRisk: 0.05 },
    { time: '12:00', amount: 2000, fraudRisk: 0.15 },
    { time: '16:00', amount: 2780, fraudRisk: 0.4 },
    { time: '20:00', amount: 1890, fraudRisk: 0.8 },
    { time: '23:59', amount: 2390, fraudRisk: 0.6 },
  ];

  const scatterData = Array.from({ length: 60 }, () => ({
    x: Math.random() * 1000, // Amount
    y: Math.random() * 24,   // Hour of day
    z: Math.random() * 100,  // Risk Score
    isFraud: Math.random() > 0.85
  }));

  const safeData = scatterData.filter(d => !d.isFraud);
  const fraudData = scatterData.filter(d => d.isFraud);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Advanced Analytics</h1>
        <p className="text-slate-500 text-sm mt-1">Deep dive into fraud patterns and model performance.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Over Time Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Fraud Risk vs Transaction Volume</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeSeriesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area yAxisId="left" type="monotone" dataKey="amount" stroke="#3b82f6" fillOpacity={1} fill="url(#colorAmount)" name="Volume ($)" />
                <Area yAxisId="right" type="monotone" dataKey="fraudRisk" stroke="#ef4444" fillOpacity={1} fill="url(#colorRisk)" name="Avg Risk Score" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Feature Distribution Scatter */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Transaction Pattern Analysis</h3>
          <p className="text-xs text-slate-500 mb-4">Amount vs Hour of Day (Circle size = Risk Score)</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" dataKey="x" name="Amount" unit="$" tick={{ fill: '#64748b' }} />
                <YAxis type="number" dataKey="y" name="Hour" unit="h" tick={{ fill: '#64748b' }} />
                <ZAxis type="number" dataKey="z" range={[50, 400]} name="Risk Score" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="Safe" data={safeData} fill="#10b981" opacity={0.6} />
                <Scatter name="Fraudulent" data={fraudData} fill="#ef4444" opacity={0.8} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
