from flask import Flask, request, jsonify
from flask_cors import CORS  

app = Flask(__name__)
CORS(app) 

@app.route("/")
def home():
    return jsonify({"message": "SkillSakhi API running"})

@app.route("/health")
def health():
    return jsonify({"status": "ok"})

@app.route("/recommend", methods=["POST"])
def recommend():
    data = request.get_json()

    age = data.get("age")
    education = data.get("education", "")
    interests = data.get("interests", "")
    skills = data.get("skills", "")
    career_goal = data.get("career_goal", "")

    # temporary dummy response
    return jsonify({
        "user_profile": {
            "age": age,
            "education": education,
            "interests": interests,
            "skills": skills,
            "career_goal": career_goal
        },
        "recommended_jobs": [
            {
                "job_title": "Data Analyst",
                "match_score": 0.89,
                "required_skills": ["Python", "SQL", "Excel", "Visualization"],
                "missing_skills": ["SQL", "Power BI"]
            },
            {
                "job_title": "Business Analyst",
                "match_score": 0.76,
                "required_skills": ["Excel", "Communication", "SQL", "Problem Solving"],
                "missing_skills": ["SQL", "Communication"]
            }
        ]
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)