from flask import Flask, request, jsonify
from flask_cors import CORS
from model.recommender import HybridCareerRecommender
from dotenv import load_dotenv
import os
import requests

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

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

    try:
        result = recommender.recommend(data, top_n=5)

        return jsonify({
            "user_profile": data,
            "predicted_category": result.get("predicted_category", "N/A"),
            "recommended_careers": result.get("recommended_careers", [])
        })

    except Exception as e:
        print("Recommend error:", e)
        return jsonify({
            "error": "Recommendation failed",
            "details": str(e),
            "recommended_careers": []
        }), 500

@app.route("/generate-resume", methods=["POST"])
def generate_resume():
    data = request.get_json() or {}

    user_profile = data.get("user_profile", {})
    career = data.get("career", {})

    name = user_profile.get("name", "Your Name")
    education = user_profile.get("education", "")
    skills = user_profile.get("skills", "").split(",")
    career_name = career.get("career_name", "Career Role")

    matched = career.get("matched_skills", [])
    missing = career.get("missing_skills", [])

    # 🎯 Smart Summary
    summary = f"""
Aspiring {career_name} with a background in {education}.
Skilled in {", ".join(matched[:3]) if matched else "basic skills"}.
Currently working on improving skills like {", ".join(missing[:3]) if missing else "advanced tools"}.
Passionate about building real-world projects and starting a career in {career_name}.
"""

    # 🚀 Smart Projects (AI-like logic)
    projects = [
        f"{career_name} Beginner Project – Implement basic concepts",
        f"{career_name} Portfolio Project – Solve a real-world problem",
        f"Skill Enhancement Project – Focus on {missing[0] if missing else 'advanced skill'}"
    ]

    resume = f"""
{name.upper()}

Target Role: {career_name}

--- PROFESSIONAL SUMMARY ---
{summary}

--- SKILLS ---
Core Skills: {", ".join(matched) if matched else user_profile.get("skills", "")}
Learning Skills: {", ".join(missing) if missing else "None"}

--- PROJECTS ---
1. {projects[0]}
2. {projects[1]}
3. {projects[2]}

--- EDUCATION ---
{education}

--- CAREER ROADMAP ---
• Complete beginner to advanced learning
• Build portfolio projects
• Apply for internships/jobs
"""

    # 💼 Better Cover Letter
    cover_letter = f"""
Dear Hiring Manager,

I am excited to apply for the {career_name} role.

With my background in {education} and skills in {", ".join(matched[:3]) if matched else user_profile.get("skills","")},
I am eager to apply my knowledge in real-world scenarios.

I have been actively working on projects and improving my skills, particularly in {", ".join(missing[:2]) if missing else "advanced tools"}.

I am a quick learner, dedicated, and highly motivated to grow in this field.

I would welcome the opportunity to contribute to your organization.

Sincerely,  
{name}
"""

    return jsonify({
        "resume": resume,
        "cover_letter": cover_letter
    })
    
    
@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json() or {}

    user_message = data.get("message", "")
    career_name = data.get("career_name", "")
    user_profile = data.get("user_profile", {})

    if not user_message:
        return jsonify({"reply": "Please ask something."})

    hf_api_key = os.getenv("HF_API_KEY")

    def fallback(reason="offline"):
        return f"""
⚠️ AI unavailable ({reason})

For {career_name or "this career"}:

• Learn required skills step-by-step  
• Practice small projects  
• Build portfolio  
• Apply for beginner jobs  

Your skills: {user_profile.get("skills", "")}
"""

    if not hf_api_key:
        return jsonify({"reply": fallback("no API key")})

    try:
        response = requests.post(
            "https://api-inference.huggingface.co/models/google/flan-t5-large",
            headers={
                "Authorization": f"Bearer {hf_api_key}",
                "Content-Type": "application/json",
            },
            json={
                "inputs": f"""
You are a helpful AI assistant.

User Profile:
Skills: {user_profile.get("skills","")}
Education: {user_profile.get("education","")}

Career Context: {career_name}

Question: {user_message}

Answer clearly in bullet points:
"""
            },
            timeout=30
        )

        print("HF status:", response.status_code)

        try:
            result = response.json()
        except:
            print("Invalid JSON:", response.text)
            return jsonify({"reply": fallback("invalid response")})

        print("HF result:", result)

        if response.status_code != 200:
            return jsonify({"reply": fallback("API error")})

        reply = ""

        # ✅ SAFE parsing
        if isinstance(result, list) and len(result) > 0:
            reply = result[0].get("generated_text", "")

        elif isinstance(result, dict):
            reply = result.get("generated_text", "")

        if not reply:
            return jsonify({"reply": fallback("empty response")})

        return jsonify({"reply": reply.strip()})

    except Exception as e:
        print("HF error:", e)
        return jsonify({"reply": fallback("connection error")})
    
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)