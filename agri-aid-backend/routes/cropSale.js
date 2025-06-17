const express = require('express');
const CropSale = require('../models/cropSale');
const router = express.Router();

// POST /api/cropsale/create - Farmer posts crop
router.post('/create', async (req, res) => {
  try {
    const newSale = new CropSale(req.body);
    await newSale.save();
    res.status(201).json(newSale);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/cropsale/farmer/:id - Get crops posted by farmer
router.get('/farmer/:id', async (req, res) => {
  try {
    const sales = await CropSale.find({ farmerId: req.params.id });
    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/cropsale/pending - For sellers to see all pending
router.get('/pending', async (req, res) => {
  try {
    const pendingSales = await CropSale.find({ status: 'pending' }).populate('farmerId', 'name location');
    res.json(pendingSales);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/cropsale/respond/:id - Seller accepts/rejects
router.put('/respond/:id', async (req, res) => {
  try {
    const { status, sellerId } = req.body;
    const updated = await CropSale.findByIdAndUpdate(
      req.params.id,
      { status, sellerId },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
