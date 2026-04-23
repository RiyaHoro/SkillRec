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
        return jsonify({"error": "No input data provided"}), 400

    recommendations = recommender.recommend(data, top_n=5)

    return jsonify({
        "user_profile": {
            "age": data.get("age", ""),
            "education": data.get("education", ""),
            "interests": data.get("interests", ""),
            "skills": data.get("skills", ""),
            "career_goal": data.get("career_goal", ""),
            "preferred_work_type": data.get("preferred_work_type", ""),
            "preferred_work_mode": data.get("preferred_work_mode", "")
        },
        "recommended_careers": recommendations
    })

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)