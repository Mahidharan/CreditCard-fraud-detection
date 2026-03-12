import React, { useState, useEffect } from 'react';
import { Search, Filter, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import axios from 'axios';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/transactions?limit=100');
      
      const formattedData = response.data.map(txn => ({
        id: txn._id.substring(0, 8).toUpperCase(),
        date: new Date(txn.timestamp).toLocaleString(),
        amount: txn.amount.toFixed(2),
        isFraud: txn.prediction === 'Fraudulent',
        riskScore: txn.risk_score
      }));
      
      setTransactions(formattedData);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
      setError("Unable to connect to the backend server.");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Transaction History</h1>
          <p className="text-slate-500 text-sm mt-1">View and filter past transactions processed by the system.</p>
        </div>
        <button 
          onClick={fetchTransactions}
          className="flex items-center px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Table Filters */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by Transaction ID..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
          </div>
          <div className="flex space-x-3 w-full sm:w-auto">
            <button className="flex items-center px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
              <Filter size={16} className="mr-2" />
              <span>Status</span>
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4 rounded-tl-xl">Transaction ID</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Risk Score</th>
                <th className="px-6 py-4 rounded-tr-xl">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                      Loading transactions...
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-red-500">
                    <AlertTriangle size={32} className="mx-auto mb-2 text-red-400" />
                    {error}
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    No transactions found yet.
                  </td>
                </tr>
              ) : (
                transactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">{txn.id}</td>
                    <td className="px-6 py-4">{txn.date}</td>
                    <td className="px-6 py-4 font-medium">${txn.amount}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-16 h-2 bg-slate-200 rounded-full mr-2">
                          <div 
                            className={`h-2 rounded-full ${txn.isFraud ? 'bg-red-500' : 'bg-emerald-500'}`} 
                            style={{ width: `${Math.round(txn.riskScore * 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-slate-500">{Math.round(txn.riskScore * 100)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {txn.isFraud ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <AlertTriangle size={12} className="mr-1" />
                          Fraudulent
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          <CheckCircle size={12} className="mr-1" />
                          Safe
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
