from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
import os
import pytesseract
from PIL import Image
import spacy
import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Load NLP model
nlp = spacy.load("en_core_web_sm")

# Blueprint setup
pesticide_scanner = Blueprint('pesticide_scanner', __name__)

# Sample pesticide info DB (in production, replace with actual data/DB)
PESTICIDE_INFO = {
    "cypermethrin": {
        "usage": "Spray 1ml per liter of water on crops affected by insects.",
        "language": {
            "en": "Spray 1ml per liter of water.",
            "te": "1 లీటర్ నీటికి 1 మిల్లీ స్ప్రే చేయండి.",
            "hi": "1 लीटर पानी में 1 मिली छिड़काव करें।"
        }
    },
    "imidacloprid": {
        "usage": "Mix 0.5 ml per liter and apply to foliage.",
        "language": {
            "en": "Apply 0.5ml per liter of water.",
            "te": "0.5 మిల్లీ లీటర్ నీటిలో కలపాలి.",
            "hi": "0.5 मिली लीटर पानी में मिलाएं।"
        }
    },
    "chlorpyrifos": {
        "usage": "Dilute 2.5 ml per liter of water and spray against sucking pests.",
        "language": {
            "en": "Dilute 2.5 ml per liter for sucking pest control.",
            "te": "సక్స్ చేసే పురుగులకు 2.5 మిల్లీని లీటర్ నీటిలో కలపండి.",
            "hi": "2.5 मिली को 1 लीटर पानी में मिलाकर छिड़कें।"
        }
    },
    "fipronil": {
        "usage": "Use 2 ml per liter for termites and soil insects.",
        "language": {
            "en": "Apply 2ml per liter for termites and soil insects.",
            "te": "2 మిల్లీని లీటర్ నీటిలో కలిపి నల్లలు మరియు నేల పురుగులకు వాడండి.",
            "hi": "2 मिली प्रति लीटर पानी में मिलाकर दीमक और मिट्टी के कीड़ों पर छिड़कें।"
        }
    },
    "acetamiprid": {
        "usage": "Use 0.3g per liter for aphids, jassids and whiteflies.",
        "language": {
            "en": "Apply 0.3g per liter for sucking pests.",
            "te": "సక్స్ చేసే పురుగులకు 0.3 గ్రాము లీటర్ నీటిలో కలపండి.",
            "hi": "0.3 ग्राम को 1 लीटर पानी में मिलाकर छिड़कें।"
        }
    },
    "carbendazim": {
        "usage": "Use 1g per liter of water to control fungal diseases.",
        "language": {
            "en": "Mix 1g per liter for fungal disease control.",
            "te": "ఫంగస్ వ్యాధుల నివారణకు 1 గ్రాము లీటర్ నీటిలో కలపండి.",
            "hi": "1 ग्राम को 1 लीटर पानी में मिलाकर फफूंद रोगों पर छिड़कें।"
        }
    },
    "mancozeb": {
        "usage": "Mix 2g per liter for blight and leaf spot prevention.",
        "language": {
            "en": "Use 2g per liter against leaf spot and blight.",
            "te": "ఆకు మచ్చలు మరియు లైట్ నివారణకు 2 గ్రాము లీటర్ నీటిలో కలపండి.",
            "hi": "2 ग्राम को 1 लीटर पानी में मिलाकर छिड़कें।"
        }
    },
    "copper_oxychloride": {
        "usage": "Use 3g per liter for fungal and bacterial diseases.",
        "language": {
            "en": "Apply 3g per liter for fungal and bacterial control.",
            "te": "ఫంగస్ మరియు బాక్టీరియా వ్యాధులకు 3 గ్రాము లీటర్ నీటిలో కలపండి.",
            "hi": "3 ग्राम को 1 लीटर पानी में मिलाकर छिड़कें।"
        }
    },
    "thiamethoxam": {
        "usage": "Use 0.25g per liter against whiteflies and aphids.",
        "language": {
            "en": "Mix 0.25g per liter for whitefly & aphid control.",
            "te": "వైట్‌ఫ్లై మరియు ఆఫిడ్లకు 0.25 గ్రాము లీటర్ నీటిలో కలపండి.",
            "hi": "0.25 ग्राम को 1 लीटर पानी में मिलाकर सफेद मक्खियों और एफिड्स पर छिड़कें।"
        }
    },
    "lambda_cyhalothrin": {
        "usage": "Spray 0.75ml per liter for bollworms and caterpillars.",
        "language": {
            "en": "Use 0.75ml per liter for bollworm control.",
            "te": "బాల్ వారం నివారణకు 0.75 మిల్లీని లీటర్ నీటిలో కలపండి.",
            "hi": "0.75 मिली को 1 लीटर पानी में मिलाकर छिड़कें।"
        }
    }
}


# ----------------- OCR Function -----------------
def extract_text_from_image(image_path):
    image = Image.open(image_path)
    text = pytesseract.image_to_string(image)
    return text.lower()

# ----------------- Improved Matcher -----------------
def identify_best_match_using_tfidf(extracted_text):
    candidates = list(PESTICIDE_INFO.keys())
    tfidf = TfidfVectorizer().fit(candidates + [extracted_text])
    vectors = tfidf.transform(candidates + [extracted_text])
    
    # Cosine similarity between extracted_text and each pesticide name
    cosine_similarities = cosine_similarity(vectors[-1], vectors[:-1]).flatten()
    max_score_index = cosine_similarities.argmax()
    max_score = cosine_similarities[max_score_index]

    if max_score > 0.2:  # You can adjust threshold based on accuracy
        return candidates[max_score_index]
    return None

# ----------------- Flask Route -----------------
@pesticide_scanner.route("/scan-pesticide", methods=["POST"])
def scan_pesticide():
    try:
        if 'image' not in request.files:
            return jsonify({"error": "No image file provided"}), 400

        image = request.files['image']
        language = request.form.get("language", "en").lower()

        filename = secure_filename(image.filename)
        filepath = os.path.join("temp_uploads", filename)
        os.makedirs("temp_uploads", exist_ok=True)
        image.save(filepath)

        pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
        extracted_text = extract_text_from_image(filepath)
        pesticide_name = identify_best_match_using_tfidf(extracted_text)
        os.remove(filepath)

        if pesticide_name:
            data = PESTICIDE_INFO[pesticide_name]
            usage_text = data["language"].get(language)
            if not usage_text:
                usage_text = data["language"].get("en", data["usage"])

            return jsonify({
                "pesticide": pesticide_name,
                "usage": usage_text,
                "language_used": language if usage_text == data["language"].get(language) else "en (fallback)"
            })

        else:
            return jsonify({"message": "No known pesticide identified in the image."}), 404

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500