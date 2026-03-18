const Prediction = require('../models/Prediction');
const axios = require('axios');

// POST /api/predict
exports.predict = async (req, res) => {
  try {
    const { loan_amnt, annual_inc, int_rate, term, dti, fico } = req.body;

    // Validate required fields
    if ([loan_amnt, annual_inc, int_rate, term, dti, fico].some(v => v === undefined || v === null)) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Try to get prediction from the local ML Flask App
    let mlResult;
    try {
      // Calculate missing inputs for ML model if necessary (installment)
       const intRateDec = int_rate / 100 / 12;
       const installment = loan_amnt * intRateDec / (1 - Math.pow(1 + intRateDec, -term));
       
      const response = await axios.post('http://127.0.0.1:5000/predict_ml', {
        loan_amnt,
        term,
        int_rate,
        installment,
        annual_inc,
        dti,
        fico_range_high: fico // ML model uses fico_range_high
      }, { timeout: 5000 }); // 5s timeout

      mlResult = response.data;
    } catch (flaskErr) {
      console.error('Flask API Error:', flaskErr.message);
      return res.status(503).json({ error: 'ML Prediction Service is currently unavailable. Please ensure the Python backend is running.' });
    }

    // mlResult contains { approval, risk_score, probability, fraud_flag, feature_importance }

    // Try to save to MongoDB (graceful if DB not connected)
    try {
      const prediction = new Prediction({
        loan_amnt, annual_inc, int_rate, term, dti, fico,
        ...mlResult
      });
      await prediction.save();
    } catch (dbErr) {
      console.warn('Could not save prediction to DB:', dbErr.message);
    }

    res.json(mlResult);
  } catch (err) {
    console.error('Prediction error:', err);
    res.status(500).json({ error: 'Prediction failed. Please try again.' });
  }
};

// GET /api/predictions/history
exports.getHistory = async (req, res) => {
  try {
    const predictions = await Prediction.find()
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(predictions);
  } catch (err) {
    console.error('History fetch error:', err);
    res.json([]);
  }
};
