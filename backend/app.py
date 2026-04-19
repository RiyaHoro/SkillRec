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
    return jsonify({
        "received": data,
        "recommendations": [
            {
                "job_title": "Data Analyst",
                "match_score": 0.88,
                "missing_skills": ["SQL", "Power BI"]
            }
        ]
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)