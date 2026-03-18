import { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, CheckCircle2, XCircle, AlertTriangle, RefreshCw, Database } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

export default function History() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('/api/predictions/history');
      setPredictions(res.data);
    } catch (err) {
      setError('Unable to fetch prediction history. Make sure the backend is running and MongoDB is connected.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold">
            <span className="gradient-text">Prediction</span>{' '}
            <span className="text-gray-800 dark:text-white">History</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            View your past loan risk assessments
          </p>
        </div>
        <button
          onClick={fetchHistory}
          className="btn-secondary flex items-center gap-2 self-start"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner text="Loading history..." />
      ) : error ? (
        <div className="card p-8 text-center">
          <Database className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Connection Issue</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto text-sm">{error}</p>
          <button onClick={fetchHistory} className="btn-primary mt-4 text-sm">
            <RefreshCw className="w-4 h-4 inline mr-2" />
            Retry
          </button>
        </div>
      ) : predictions.length === 0 ? (
        <div className="card p-12 text-center">
          <Clock className="w-16 h-16 text-gray-200 dark:text-gray-700 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">No Predictions Yet</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Make your first loan risk prediction to see it here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {predictions.map((pred, index) => (
            <div
              key={pred._id || index}
              className="card-hover p-5 flex flex-col sm:flex-row sm:items-center gap-4"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Status icon */}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                pred.approval === 1
                  ? 'bg-emerald-100 dark:bg-emerald-500/20'
                  : 'bg-red-100 dark:bg-red-500/20'
              }`}>
                {pred.approval === 1
                  ? <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  : <XCircle className="w-6 h-6 text-red-500" />
                }
              </div>

              {/* Details */}
              <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider">Loan</p>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">{formatCurrency(pred.loan_amnt)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider">FICO</p>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">{pred.fico}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider">Risk</p>
                  <p className={`font-semibold ${
                    pred.risk_score <= 40 ? 'text-emerald-500'
                      : pred.risk_score <= 70 ? 'text-amber-500'
                      : 'text-red-500'
                  }`}>
                    {pred.risk_score}/100
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider">Probability</p>
                  <p className="font-semibold gradient-text">{pred.probability}%</p>
                </div>
              </div>

              {/* Fraud + Date */}
              <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                {pred.fraud_flag && (
                  <span className="flex items-center gap-1 text-xs font-medium text-red-500 bg-red-50 dark:bg-red-500/10 px-2 py-1 rounded-full">
                    <AlertTriangle className="w-3 h-3" />
                    Fraud
                  </span>
                )}
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {pred.createdAt ? formatDate(pred.createdAt) : '—'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
