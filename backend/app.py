from flask import Flask, request, jsonify
from flask_cors import CORS
from model.recommender import JobRecommender

app = Flask(__name__)
CORS(app)

recommender = JobRecommender("data/jobs.csv")

@app.route("/")
def home():
    return jsonify({"message": "SkillSakhi API running"})

@app.route("/health")
def health():
    return jsonify({"status": "ok"})

@app.route("/recommend", methods=["POST"])
def recommend():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No input data provided"}), 400

    recommendations = recommender.recommend_jobs(data, top_n=3)

    return jsonify({
        "user_profile": {
            "age": data.get("age", ""),
            "education": data.get("education", ""),
            "interests": data.get("interests", ""),
            "skills": data.get("skills", ""),
            "career_goal": data.get("career_goal", "")
        },
        "recommended_jobs": recommendations
    })

if __name__ == "__main__":
    app.run(debug=True)