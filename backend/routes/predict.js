const express = require('express');
const router = express.Router();
const { predict, getHistory } = require('../controllers/predictController');

router.post('/predict', predict);
router.get('/predictions/history', getHistory);

module.exports = router;
