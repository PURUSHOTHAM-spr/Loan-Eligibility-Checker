const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  // Input fields
  loan_amnt: { type: Number, required: true },
  annual_inc: { type: Number, required: true },
  int_rate: { type: Number, required: true },
  term: { type: Number, required: true },
  dti: { type: Number, required: true },
  fico: { type: Number, required: true },

  // Prediction output
  approval: { type: Number, required: true },
  risk_score: { type: Number, required: true },
  probability: { type: Number, required: true },
  fraud_flag: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Prediction', predictionSchema);
