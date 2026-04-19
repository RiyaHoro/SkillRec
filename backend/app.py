# app.py
from flask import Flask, request, jsonify
from model.recommender import recommend_jobs
from model.skill_extractor import extract_skills

app = Flask(__name__)

@app.route("/recommend", methods=["POST"])
def recommend():
    data = request.json
    text = data.get("skills")

    extracted_skills = extract_skills(text)
    jobs = recommend_jobs(extracted_skills)

    return jsonify(jobs.to_dict(orient="records"))

if __name__ == "__main__":
    app.run(debug=True)