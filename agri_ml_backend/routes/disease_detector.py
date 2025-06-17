from flask import Blueprint, request, jsonify
from keras.models import load_model
import json
import os

from utils.image_preprocess import preprocess_image

disease_detector = Blueprint('disease_detector', __name__)

# Load model and label map once
model_path = os.path.join("models", "plant_disease_model.h5")
label_map_path = os.path.join("models", "label_map.json")

model = load_model(model_path)
with open(label_map_path, "r") as f:
    label_map = json.load(f)

# Reverse map: index → label
idx_to_label = {int(k): v for k, v in label_map.items()}

@disease_detector.route('/predict-disease', methods=['POST'])
def predict_disease():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    image_file = request.files['image']
    try:
        processed_image = preprocess_image(image_file)
        prediction = model.predict(processed_image)
        predicted_class = int(prediction.argmax())
        confidence = float(prediction[0][predicted_class])
        
        return jsonify({
            'predicted_label': idx_to_label[predicted_class],
            'confidence': round(confidence, 3)
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500
