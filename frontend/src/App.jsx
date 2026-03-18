import { useState } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import Form from './components/Form';
import Dashboard from './components/Dashboard';
import History from './components/History';
import LoadingSpinner from './components/LoadingSpinner';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function App() {
  const [page, setPage] = useState('home');       // 'home' | 'history'
  const [view, setView] = useState('form');        // 'form' | 'loading' | 'results' | 'error'
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handlePredict = async (formData) => {
    setView('loading');
    setError('');

    try {
      const res = await axios.post('/api/predict', formData);
      setResult(res.data);
      setView('results');
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.message ||
        'Something went wrong. Please try again.';
      setError(message);
      setView('error');
    }
  };

  const handleReset = () => {
    setView('form');
    setResult(null);
    setError('');
  };

  const handleNavigate = (target) => {
    setPage(target);
    if (target === 'home') {
      handleReset();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar currentPage={page} onNavigate={handleNavigate} />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {page === 'history' ? (
          <History />
        ) : (
          <div className="flex flex-col items-center justify-center">
            {view === 'form' && (
              <Form onSubmit={handlePredict} isLoading={false} />
            )}

            {view === 'loading' && (
              <div className="w-full max-w-2xl mx-auto">
                <div className="card p-12">
                  <LoadingSpinner text="Running AI risk analysis..." />
                </div>
              </div>
            )}

            {view === 'results' && result && (
              <Dashboard result={result} onReset={handleReset} />
            )}

            {view === 'error' && (
              <div className="w-full max-w-lg mx-auto animate-fade-in">
                <div className="card p-8 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                    Prediction Failed
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
                    {error}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button onClick={() => setView('form')} className="btn-primary flex items-center justify-center gap-2">
                      <RotateCcw className="w-4 h-4" />
                      Try Again
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200/50 dark:border-gray-700/50 py-6">
        <p className="text-center text-xs text-gray-400 dark:text-gray-500">
          © 2026 Loan Risk Predictor. Built with React, Express & MongoDB.
          <br />
          <span className="text-gray-300 dark:text-gray-600">
            AI predictions are for demonstration purposes only. Not financial advice.
          </span>
        </p>
      </footer>
    </div>
  );
}
