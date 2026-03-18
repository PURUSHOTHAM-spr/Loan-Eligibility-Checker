import { CheckCircle2, XCircle, AlertTriangle, RotateCcw, TrendingUp, Shield, Zap } from 'lucide-react';
import GaugeChart from './GaugeChart';
import FeatureImportanceChart from './FeatureImportanceChart';

export default function Dashboard({ result, onReset }) {
  const { approval, risk_score, probability, fraud_flag, feature_importance } = result;
  const isApproved = approval === 1;

  return (
    <div className="w-full max-w-5xl mx-auto animate-slide-up">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold mb-2">
          <span className="gradient-text">Prediction</span>{' '}
          <span className="text-gray-800 dark:text-white">Results</span>
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Here's your AI-powered loan risk assessment
        </p>
      </div>

      {/* Fraud Alert */}
      {fraud_flag && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 flex items-start gap-3 animate-fade-in">
          <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-red-700 dark:text-red-400">Fraud Risk Detected</h4>
            <p className="text-sm text-red-600 dark:text-red-300/80 mt-0.5">
              Unusual patterns detected in your application. This may affect the approval decision. Please verify your information.
            </p>
          </div>
        </div>
      )}

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        {/* Approval Status */}
        <div className={`card-hover p-6 text-center border-2 ${
          isApproved
            ? 'border-emerald-200 dark:border-emerald-500/30 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-500/5 dark:to-surface-800'
            : 'border-red-200 dark:border-red-500/30 bg-gradient-to-br from-red-50 to-white dark:from-red-500/5 dark:to-surface-800'
        }`}>
          <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center ${
            isApproved
              ? 'bg-emerald-100 dark:bg-emerald-500/20'
              : 'bg-red-100 dark:bg-red-500/20'
          }`}>
            {isApproved
              ? <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              : <XCircle className="w-8 h-8 text-red-500" />
            }
          </div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
            Loan Status
          </h3>
          <p className={`text-2xl font-bold ${
            isApproved ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
          }`}>
            {isApproved ? 'Approved' : 'Rejected'}
          </p>
        </div>

        {/* Probability */}
        <div className="card-hover p-6 text-center">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-primary-100 dark:bg-primary-500/20">
            <TrendingUp className="w-8 h-8 text-primary-500" />
          </div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
            Approval Probability
          </h3>
          <p className="text-4xl font-bold gradient-text">{probability}%</p>
        </div>

        {/* Quick Risk */}
        <div className="card-hover p-6 text-center">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-amber-100 dark:bg-amber-500/20">
            <Shield className="w-8 h-8 text-amber-500" />
          </div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
            Risk Level
          </h3>
          <p className={`text-2xl font-bold ${
            risk_score <= 40 ? 'text-emerald-600 dark:text-emerald-400'
              : risk_score <= 70 ? 'text-amber-600 dark:text-amber-400'
              : 'text-red-600 dark:text-red-400'
          }`}>
            {risk_score <= 40 ? 'Low' : risk_score <= 70 ? 'Medium' : 'High'}
          </p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        {/* Gauge */}
        <div className="card-hover p-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-primary-500" />
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">Risk Score</h3>
          </div>
          <div className="flex justify-center">
            <GaugeChart value={risk_score} size={260} />
          </div>
        </div>

        {/* Feature Importance */}
        <div className="card-hover p-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-primary-500" />
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">Feature Importance</h3>
          </div>
          <FeatureImportanceChart data={feature_importance} />
        </div>
      </div>

      {/* Reset */}
      <div className="flex justify-center">
        <button onClick={onReset} className="btn-secondary flex items-center gap-2">
          <RotateCcw className="w-4 h-4" />
          Try Another Prediction
        </button>
      </div>
    </div>
  );
}
