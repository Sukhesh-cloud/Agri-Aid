const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");
require("dotenv").config();

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => res.send("AgriAid API running"));

const cropSaleRoutes = require('./routes/cropSale');
app.use('/api/cropsale', cropSaleRoutes);

const marketPricesRoute = require('./routes/marketPrices');
app.use('/api/market-prices', marketPricesRoute);

const summarizerRoute = require('./routes/summarizer');
app.use('/api/summarizer', summarizerRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
