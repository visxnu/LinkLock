from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pickle
import warnings
warnings.filterwarnings('ignore')
from feature import feature_extraction
from flask import Flask, request, jsonify

app = Flask(__name__)
CORS(app)  # Enable CORS for Chrome extension

# Load the trained model
file = open("model.pkl", "rb")
gbc = pickle.load(file)
file.close()

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Flask API is running!"})

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        url = data.get("url")
        if not url:
            return jsonify({"error": "No URL provided"}), 400

        # Extract features
        obj = feature_extraction(url)
        x = np.array(obj.getFeaturesList()).reshape(1, 30)

        # Predict
        y_pred = gbc.predict(x)[0]  # 1 = safe, -1 = unsafe
        y_pro_phishing = gbc.predict_proba(x)[0, 0]  # Probability of phishing
        y_pro_non_phishing = gbc.predict_proba(x)[0, 1]  # Probability of safe

        # Return result
        result = {
            "url": url,
            "is_phishing": bool(y_pred == -1),  # True if phishing
            "phishing_probability": float(round(y_pro_phishing * 100, 2)),
            "safe_probability": float(round(y_pro_non_phishing * 100, 2))
        }
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)