import React, { useState } from 'react';
import { Send, CheckCircle, AlertOctagon, RefreshCw, ShieldCheck } from 'lucide-react';
import axios from 'axios';

const TransactionInput = () => {
  const [formData, setFormData] = useState({
    amount: '',
    transaction_time: '',
    merchant_category: '',
    distance_from_home: '',
    transaction_location: 'New York, US',
    device_type: 'Mobile'
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const payload = {
        amount: parseFloat(formData.amount),
        transaction_time: parseInt(formData.transaction_time, 10),
        merchant_category: parseInt(formData.merchant_category, 10),
        distance_from_home: parseFloat(formData.distance_from_home),
        transaction_location: formData.transaction_location,
        device_type: formData.device_type
      };

      const response = await axios.post('http://localhost:8000/predict', payload);
      
      setResult({
        prediction: response.data.prediction === 'Fraudulent' ? 1 : 0,
        risk_score: response.data.risk_score,
        status: 'success'
      });
      setLoading(false);
    } catch (error) {
      console.error("Prediction failed", error);
      setLoading(false);
      setResult({ status: 'error', message: 'Failed to connect to detection server.' });
    }
  };

  const resetForm = () => {
    setFormData({ 
      amount: '', 
      transaction_time: '', 
      merchant_category: '', 
      distance_from_home: '',
      transaction_location: 'New York, US',
      device_type: 'Mobile'
    });
    setResult(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">New Transaction</h1>
        <p className="text-slate-500 text-sm mt-1">Submit transaction details for real-time fraud analysis.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Transaction Amount ($)</label>
                <input
                  type="number"
                  name="amount"
                  required
                  step="0.01"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="e.g. 150.00"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Transaction Time</label>
                <input
                  type="number"
                  name="transaction_time"
                  required
                  value={formData.transaction_time}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="e.g. 1200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Merchant Category (Code)</label>
                <input
                  type="number"
                  name="merchant_category"
                  required
                  value={formData.merchant_category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="e.g. 5411"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Distance from Home (Miles)</label>
                <input
                  type="number"
                  step="0.1"
                  name="distance_from_home"
                  required
                  value={formData.distance_from_home}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="e.g. 15.5"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Location</label>
                <input
                  type="text"
                  name="transaction_location"
                  value={formData.transaction_location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="e.g. New York, US"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Device Type</label>
                <select
                  name="device_type"
                  value={formData.device_type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="Mobile">Mobile</option>
                  <option value="Desktop">Desktop</option>
                  <option value="Tablet">Tablet</option>
                  <option value="POS">POS Terminal</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-4 pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/50 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? <RefreshCw className="animate-spin mr-2" size={18} /> : <Send className="mr-2" size={18} />}
                {loading ? 'Analyzing...' : 'Analyze Transaction'}
              </button>
              
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 focus:ring-4 focus:ring-slate-200 transition-colors"
              >
                Clear Form
              </button>
            </div>
          </form>
        </div>

        {/* Results Section */}
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 flex flex-col justify-center items-center text-center min-h-[300px]">
          {!result && !loading && (
            <div className="text-slate-400 flex flex-col items-center space-y-3">
              <ShieldCheck size={48} strokeWidth={1.5} />
              <p>Submit a transaction to see fraud detection results.</p>
            </div>
          )}
          
          {loading && (
            <div className="text-blue-500 flex flex-col items-center space-y-4">
              <RefreshCw size={48} strokeWidth={1.5} className="animate-spin" />
              <p className="text-slate-600 font-medium animate-pulse">Running KNN model inference...</p>
            </div>
          )}

          {result && result.status === 'success' && (
            <div className={`w-full p-6 rounded-lg text-white animate-in zoom-in duration-300 ${result.prediction === 1 ? 'bg-red-500 shadow-red-200' : 'bg-emerald-500 shadow-emerald-200'} shadow-lg`}>
              {result.prediction === 1 ? (
                <AlertOctagon size={56} className="mx-auto mb-4" />
              ) : (
                <CheckCircle size={56} className="mx-auto mb-4" />
              )}
              
              <h3 className="text-2xl font-bold mb-1">
                {result.prediction === 1 ? 'FRAUD ALERT' : 'SAFE TRANSACTION'}
              </h3>
              
              <div className="mt-6 pt-6 border-t border-white/20 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-white/70 text-sm font-medium">Risk Score</p>
                  <p className="text-xl font-bold">{Math.round(result.risk_score * 100)}%</p>
                </div>
                <div>
                  <p className="text-white/70 text-sm font-medium">Model</p>
                  <p className="text-lg font-bold">KNN</p>
                </div>
              </div>
            </div>
          )}

          {result && result.status === 'error' && (
            <div className="text-red-500 flex flex-col items-center space-y-3">
              <AlertOctagon size={48} strokeWidth={1.5} />
              <p className="font-medium">{result.message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionInput;
