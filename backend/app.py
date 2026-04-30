from flask import Flask, request, jsonify
from flask_cors import CORS
from model.recommender import HybridCareerRecommender

app = Flask(__name__)
CORS(app)

recommender = HybridCareerRecommender("data/careers.csv")

@app.route("/")
def home():
    return jsonify({"message": "SkillSakhi backend is running"})

@app.route("/health")
def health():
    return jsonify({"status": "ok"})

@app.route("/recommend", methods=["POST"])
def recommend():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No input data"}), 400

    result = recommender.recommend(data, top_n=5)

    return jsonify({
        "user_profile": data,
        "predicted_category": result["predicted_category"],
        "recommended_careers": result["recommended_careers"]
    })
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)