// models/CropSale.js
const mongoose = require("mongoose");

const cropSaleSchema = new mongoose.Schema({
  cropName: { type: String, required: true },
  quantity: { type: Number, required: true }, // in kg or quintal
  pricePerUnit: { type: Number, required: true },
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // null until accepted
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'sold'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("CropSale", cropSaleSchema);
