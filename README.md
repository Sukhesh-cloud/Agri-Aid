# 🌾 AgriAid 360 - AI-Powered Precision Farming Platform

AgriAid 360 is a bilingual AI-powered precision farming assistant designed for small-scale farmers. It empowers users with disease detection, real-time weather alerts, AI summarization, a multilingual interface, and a dynamic crop marketplace.

---

## 🚀 Features

### 👨‍🌾 Farmer Dashboard
- 🧠 **AI Query Summarization** using Gemini API with translation support.
- 🌿 **Crop Disease Detection** via PlantVillage-trained model.
- 🌐 **Multilingual Support** (Hindi, Telugu, etc.).
- 🌦️ **Weather Alerts** based on location.
- 📦 **Sell Crops** and receive updates once sold.

### 🧑‍💼 Seller Dashboard
- 🔍 **View & Filter Listings** by crop, location, etc.
- 🤝 **Accept/Reject Deals** and notify farmers directly.

---

## 🛠️ Tech Stack

| Layer         | Technologies                                      |
|---------------|---------------------------------------------------|
| **Frontend**  | Angular 17, HTML/CSS, TypeScript                  |
| **Backend**   | Node.js (Express), MongoDB, JWT Auth              |
| **ML APIs**   | Python (Flask), TensorFlow/Keras, Tesseract OCR   |
| **External**  | Gemini Pro API, OpenWeatherMap                    |

---

## 🧠 ML Modules

- ✅ **Crop Disease Classifier** – CNN trained on 15 PlantVillage classes.
- ✅ **Pesticide Label NLP** – OCR + rule-based NLP summarizer.
- ✅ **Gemini-Powered Query Summarization** – Agricultural Q&A via generative AI.

---

## 📦 Setup Instructions

### 1. Clone Repo
```bash
git clone https://github.com/yourusername/AgriAid-360.git
cd AgriAid-360

cd agri-aid-backend
npm install
npm run dev

cd agri-aid-frontend
npm install
ng serve

cd agri_ml_backend
pip install -r requirements.txt
python app.py


GOOGLE_API_KEY=your_gemini_api_key
MONGO_URI=your_mongodb_uri
PORT=5000




