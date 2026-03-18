import { useState } from 'react';
import { DollarSign, Percent, Calendar, TrendingUp, CreditCard, BarChart3, RotateCcw, ArrowRight } from 'lucide-react';

const INITIAL_FORM = {
  loan_amnt: '',
  annual_inc: '',
  int_rate: '',
  term: '36',
  dti: '',
  fico: '',
};

const FIELDS = [
  {
    name: 'loan_amnt',
    label: 'Loan Amount',
    icon: DollarSign,
    type: 'number',
    placeholder: 'e.g. 25000',
    min: 500,
    max: 1000000,
    prefix: '$',
    hint: '$500 – $1,000,000',
  },
  {
    name: 'annual_inc',
    label: 'Annual Income',
    icon: TrendingUp,
    type: 'number',
    placeholder: 'e.g. 75000',
    min: 1000,
    max: 10000000,
    prefix: '$',
    hint: 'Your gross annual income',
  },
  {
    name: 'int_rate',
    label: 'Interest Rate',
    icon: Percent,
    type: 'number',
    placeholder: 'e.g. 12.5',
    min: 0.5,
    max: 30,
    step: '0.1',
    suffix: '%',
    hint: '0.5% – 30%',
  },
  {
    name: 'term',
    label: 'Loan Term',
    icon: Calendar,
    type: 'select',
    options: [
      { value: '36', label: '36 months' },
      { value: '60', label: '60 months' },
    ],
  },
  {
    name: 'dti',
    label: 'Debt-to-Income Ratio',
    icon: BarChart3,
    type: 'number',
    placeholder: 'e.g. 18.5',
    min: 0,
    max: 60,
    step: '0.1',
    suffix: '%',
    hint: '0% – 60%',
  },
  {
    name: 'fico',
    label: 'FICO Score',
    icon: CreditCard,
    type: 'number',
    placeholder: 'e.g. 720',
    min: 300,
    max: 850,
    hint: '300 – 850',
  },
];

export default function Form({ onSubmit, isLoading }) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validate = () => {
    const newErrors = {};
    FIELDS.forEach(({ name, min, max, label, type }) => {
      if (type === 'select') return;
      const val = parseFloat(formData[name]);
      if (!formData[name] || isNaN(val)) {
        newErrors[name] = `${label} is required`;
      } else if (min !== undefined && val < min) {
        newErrors[name] = `Minimum value is ${min}`;
      } else if (max !== undefined && val > max) {
        newErrors[name] = `Maximum value is ${max}`;
      }
    });
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const fieldConfig = FIELDS.find(f => f.name === name);
    if (fieldConfig && fieldConfig.type !== 'select') {
      const val = parseFloat(formData[name]);
      if (!formData[name] || isNaN(val)) {
        setErrors(prev => ({ ...prev, [name]: `${fieldConfig.label} is required` }));
      } else if (fieldConfig.min !== undefined && val < fieldConfig.min) {
        setErrors(prev => ({ ...prev, [name]: `Minimum value is ${fieldConfig.min}` }));
      } else if (fieldConfig.max !== undefined && val > fieldConfig.max) {
        setErrors(prev => ({ ...prev, [name]: `Maximum value is ${fieldConfig.max}` }));
      } else {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    setTouched(FIELDS.reduce((acc, f) => ({ ...acc, [f.name]: true }), {}));

    if (Object.keys(validationErrors).length === 0) {
      onSubmit({
        loan_amnt: parseFloat(formData.loan_amnt),
        annual_inc: parseFloat(formData.annual_inc),
        int_rate: parseFloat(formData.int_rate),
        term: parseInt(formData.term),
        dti: parseFloat(formData.dti),
        fico: parseInt(formData.fico),
      });
    }
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM);
    setErrors({});
    setTouched({});
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold mb-3">
          <span className="gradient-text">Assess Your</span>{' '}
          <span className="text-gray-800 dark:text-white">Loan Risk</span>
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          Enter your financial details below to get an instant AI-powered risk assessment and eligibility prediction.
        </p>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="card p-6 sm:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {FIELDS.map(({ name, label, icon: Icon, type, placeholder, options, step, prefix, suffix, hint }) => (
            <div key={name} className={name === 'loan_amnt' || name === 'annual_inc' ? 'sm:col-span-1' : ''}>
              <label htmlFor={name} className="label flex items-center gap-1.5">
                <Icon className="w-3.5 h-3.5" />
                {label}
              </label>
              {type === 'select' ? (
                <select
                  id={name}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className="input-field cursor-pointer"
                >
                  {options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              ) : (
                <div className="relative">
                  {prefix && (
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm font-medium">
                      {prefix}
                    </span>
                  )}
                  <input
                    id={name}
                    name={name}
                    type="number"
                    value={formData[name]}
                    onChange={handleChange}
                    onBlur={() => handleBlur(name)}
                    placeholder={placeholder}
                    step={step || 'any'}
                    className={`input-field ${prefix ? 'pl-8' : ''} ${suffix ? 'pr-8' : ''} ${
                      touched[name] && errors[name]
                        ? 'border-red-400 dark:border-red-500 focus:ring-red-500/40 focus:border-red-500'
                        : ''
                    }`}
                  />
                  {suffix && (
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm font-medium">
                      {suffix}
                    </span>
                  )}
                </div>
              )}
              {hint && !errors[name] && (
                <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{hint}</p>
              )}
              {touched[name] && errors[name] && (
                <p className="mt-1 text-xs text-red-500 dark:text-red-400 animate-fade-in">{errors[name]}</p>
              )}
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary flex-1 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                Predict Loan Eligibility
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="btn-secondary flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
