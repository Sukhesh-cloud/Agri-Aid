const express = require('express');
const router = express.Router();

// Mock market price data (replace this with a real API call if available)
const marketPrices = [
  { crop: "Wheat", price: 2200, unit: "quintal", trend: "rising" },
  { crop: "Rice", price: 1850, unit: "quintal", trend: "falling" },
  { crop: "Tomato", price: 2600, unit: "quintal", trend: "rising" },
  { crop: "Onion", price: 1800, unit: "quintal", trend: "stable" },
];

router.get('/', (req, res) => {
  res.json(marketPrices);
});

module.exports = router;
