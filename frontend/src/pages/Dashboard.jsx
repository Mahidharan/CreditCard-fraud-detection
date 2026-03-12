import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Activity, ShieldCheck, AlertTriangle, CreditCard, RefreshCw } from 'lucide-react';
import axios from 'axios';

const COLORS = ['#10b981', '#ef4444']; // emerald-500 for Safe, red-500 for Fraud

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    safe: 0,
    fraud: 0,
    fraudRate: 0
  });

  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:8000/analytics');
      const data = response.data;
      
      setStats({
        total: data.summary.total_transactions,
        safe: data.summary.safe_transactions,
        fraud: data.summary.fraudulent_transactions,
        fraudRate: data.summary.fraud_risk_percentage
      });

      // Format hourly trends for the chart
      const formattedTrends = data.hourly_trends.map(item => ({
        name: `Time: ${item.hour}`,
        total: item.total,
        fraud: item.fraud
      }));
      setTrendData(formattedTrends);
      
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch analytics", err);
      setError("Unable to connect to the backend server to fetch analytics.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const pieData = [
    { name: 'Safe', value: stats.safe },
    { name: 'Fraud', value: stats.fraud },
  ];

  if (loading && stats.total === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
        <RefreshCw size={48} className="animate-spin text-blue-500 mb-4" />
        <p className="text-slate-500 font-medium animate-pulse">Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
          <p className="text-slate-500 text-sm mt-1">Real-time credit card fraud detection statistics.</p>
        </div>
        <button 
          onClick={fetchAnalytics}
          className="flex items-center px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <CreditCard size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Transactions</p>
            <h3 className="text-2xl font-bold text-slate-800">{stats.total.toLocaleString()}</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
            <ShieldCheck size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Safe Transactions</p>
            <h3 className="text-2xl font-bold text-slate-800">{stats.safe.toLocaleString()}</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Fraudulent</p>
            <h3 className="text-2xl font-bold text-slate-800">{stats.fraud.toLocaleString()}</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Fraud Rate</p>
            <h3 className="text-2xl font-bold text-slate-800">{stats.fraudRate}%</h3>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 col-span-2">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Transaction Volume by Processing Time</h3>
          <div className="h-80">
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    cursor={{ fill: '#f8fafc' }}
                  />
                  <Legend />
                  <Bar dataKey="total" name="Total Volume" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="fraud" name="Fraudulent" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                No trend data available yet
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Fraud Distribution</h3>
          <div className="h-80">
            {stats.total > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                Submit transactions to view distribution
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
