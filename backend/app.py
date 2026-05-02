from flask import Flask, request, jsonify
from flask_cors import CORS
from model.recommender import HybridCareerRecommender
from dotenv import load_dotenv
import os
import requests
import google.generativeai as genai

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    gemini_model = genai.GenerativeModel("gemini-2.5-flash")
else:
    gemini_model = None

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
    template = data.get("template", "ats")

    name = user_profile.get("name", "Your Name")
    email = user_profile.get("email", "your.email@example.com")
    phone = user_profile.get("phone", "Your Phone Number")
    location = user_profile.get("location", "Your Location")

    education = user_profile.get("education", "Your Education")
    interests = user_profile.get("interests", "N/A")
    career_stage = user_profile.get("career_stage", "N/A")
    preferred_work_mode = user_profile.get("preferred_work_mode", "Flexible")

    career_name = career.get("career_name", "").strip() or "Career Role"

    role_library = {
        "digital marketing assistant": {
            "category": "Marketing",
            "skills": ["Canva", "Social Media Marketing", "SEO", "Content Writing", "Basic Analytics"],
            "tools": ["Canva", "Instagram", "Facebook", "Google Analytics", "Google Search Console"],
            "projects": [
                "Created a sample Instagram content calendar for a small business",
                "Designed promotional posts using Canva for a digital campaign",
                "Practiced SEO keyword research and blog content optimization"
            ],
            "keywords": ["Digital Marketing", "SEO", "Social Media", "Content Marketing", "Canva"]
        },
        "data analyst": {
            "category": "Data Analytics",
            "skills": ["Excel", "SQL", "Python", "Power BI", "Data Cleaning"],
            "tools": ["Excel", "SQL", "Python", "Power BI", "Tableau"],
            "projects": [
                "Analyzed sales data using Excel and created dashboards",
                "Cleaned and visualized datasets using Python",
                "Built a Power BI dashboard to show business insights"
            ],
            "keywords": ["Data Analysis", "Excel", "SQL", "Python", "Dashboard", "Power BI"]
        },
        "web developer": {
            "category": "Web Development",
            "skills": ["HTML", "CSS", "JavaScript", "React", "Git"],
            "tools": ["VS Code", "GitHub", "React", "Tailwind CSS", "Vercel"],
            "projects": [
                "Built a responsive portfolio website",
                "Created a React-based web application",
                "Designed reusable UI components using Tailwind CSS"
            ],
            "keywords": ["Frontend Development", "React", "JavaScript", "HTML", "CSS"]
        },
        "ui ux designer": {
            "category": "Design",
            "skills": ["Figma", "Wireframing", "Prototyping", "User Research", "Visual Design"],
            "tools": ["Figma", "Canva", "Adobe XD"],
            "projects": [
                "Designed mobile app wireframes for a career guidance platform",
                "Created a clickable prototype in Figma",
                "Improved UI layout based on user-friendly design principles"
            ],
            "keywords": ["UI Design", "UX Research", "Wireframe", "Prototype", "Figma"]
        },
        "teacher": {
            "category": "Education",
            "skills": ["Communication", "Lesson Planning", "Subject Knowledge", "Classroom Management"],
            "tools": ["Google Classroom", "PowerPoint", "YouTube", "Canva"],
            "projects": [
                "Prepared beginner-friendly lesson plans",
                "Created educational presentation materials",
                "Designed practice worksheets for students"
            ],
            "keywords": ["Teaching", "Lesson Planning", "Communication", "Education"]
        }
    }

    key = career_name.lower().strip()
    role_data = role_library.get(key)

    if not role_data:
        role_data = {
            "category": career.get("category", "General"),
            "skills": career.get("matched_skills", []) or career.get("required_skills", []) or ["Communication", "Problem Solving", "Basic Computer Knowledge"],
            "tools": career.get("missing_skills", []) or ["Career-relevant tools", "Portfolio Projects"],
            "projects": [
                f"Created a beginner portfolio project related to {career_name}",
                f"Practiced important skills required for {career_name}",
                f"Built a practical project to understand real-world work in {career_name}"
            ],
            "keywords": [career_name, career.get("category", "Career Skills")]
        }

    category = role_data["category"]
    core_skills = role_data["skills"]
    tools = role_data["tools"]
    projects = role_data["projects"]
    keywords = role_data["keywords"]

    note = """
NOTE:
This is a sample resume generated by SkillSakhi. Please use it as a reference format.
Edit it by adding your real college/university name, passing year, projects, internship experience, certifications, and correct contact details.
"""

    resume = f"""
{name}
{email} | {phone} | {location}

{note}

TARGET ROLE
{career_name}

PROFESSIONAL SUMMARY
Aspiring {career_name} with a background in {education}.
Interested in {interests} and focused on building practical experience in {category}.
Skilled in {", ".join(core_skills[:5])} and currently improving job-ready skills through projects and continuous learning.

EDUCATION
{education}
Add your college/university name here
Add passing year here

CORE SKILLS
{", ".join(core_skills)}

TOOLS / LEARNING AREAS
{", ".join(tools)}

PROJECTS
1. {projects[0]}
   - Applied basic concepts related to {career_name}.
   - Improved practical understanding through hands-on work.

2. {projects[1]}
   - Used relevant tools and techniques required in {category}.
   - Strengthened portfolio with practical learning.

3. {projects[2]}
   - Focused on solving a real-world beginner-level problem.
   - Improved confidence and job readiness.

CERTIFICATIONS
Add relevant certifications or online courses here.

CAREER PLAN
• Build 2–3 strong portfolio projects
• Improve practical skills in {", ".join(tools[:3])}
• Apply for internships, freelance work, or beginner-friendly jobs
• Keep updating resume with real achievements

RELEVANT KEYWORDS
{", ".join(keywords)}
"""

    cover_letter = f"""
Dear Hiring Manager,

I am writing to express my interest in the {career_name} role.

I have an educational background in {education} and an interest in {category}. I am developing skills in {", ".join(core_skills[:5])} and building practical projects to improve my job readiness.

I am a quick learner, sincere, and motivated to grow professionally. I would be grateful for the opportunity to contribute to your organization and continue learning in this field.

Thank you for considering my application.

Sincerely,
{name}
"""

    return jsonify({
        "resume": resume.strip(),
        "cover_letter": cover_letter.strip()
    })

@app.route("/chat", methods=["POST"])
def chat():
        data = request.get_json() or {}

        user_message = data.get("message", "").strip()
        career_name = data.get("career_name", "").strip()
        user_profile = data.get("user_profile", {}) or {}

        education = user_profile.get("education", "Not provided")
        skills = user_profile.get("skills", "Not provided")
        interests = user_profile.get("interests", "Not provided")

        if not user_message:
            return jsonify({"reply": "Please type your question."})

        prompt = f"""
    You are SkillSakhi AI Career Assistant.

    User Profile:
    Career: {career_name or "Not selected"}
    Education: {education}
    Skills: {skills}
    Interests: {interests}

    User Question:
    {user_message}

    Give a simple, practical, beginner-friendly answer.
    Keep it useful for Indian students and freshers.
    Use short points.
    """

        # Try Gemini first
        try:
            if gemini_model:
                response = gemini_model.generate_content(prompt)

                if response and response.text:
                    return jsonify({"reply": response.text.strip()})

        except Exception as e:
            print("Gemini error:", e)

        # Permanent fallback: chatbot still works even if AI/API fails
        msg = user_message.lower()
        role = career_name or "your selected career"

        if "roadmap" in msg or "start" in msg:
            reply = f"""
    For {role}, follow this roadmap:

    1. Learn the basic concepts.
    2. Improve required skills step by step.
    3. Complete 1–2 beginner projects.
    4. Create a simple resume and portfolio.
    5. Apply for internships, freelance work, or entry-level jobs.
    """
        elif "skill" in msg:
            reply = f"""
    For {role}, focus on:

    1. Communication skills
    2. Basic computer knowledge
    3. Problem-solving
    4. Role-specific technical skills
    5. Portfolio or practical project work
    """
        elif "course" in msg:
            reply = f"""
    For {role}, choose beginner-friendly courses from:

    1. YouTube
    2. Coursera
    3. Google Digital Garage
    4. LinkedIn Learning
    5. FreeCodeCamp or Udemy

    Start with one course and build a small project after completing it.
    """
        elif "resume" in msg:
            reply = f"""
    For a {role} resume, include:

    1. Professional summary
    2. Education with college name
    3. Skills
    4. Projects
    5. Certifications
    6. Internship or fresher experience

    Use the generated resume as a reference format and edit it with your real details.
    """
        elif "internship" in msg or "job" in msg:
            reply = f"""
    To get an internship for {role}:

    1. Prepare a simple resume.
    2. Build 1–2 relevant projects.
    3. Apply on LinkedIn, Internshala, Naukri, and company websites.
    4. Message recruiters politely.
    5. Keep improving your skills while applying.
    """
        else:
            reply = f"""
    I can help you with {role} career guidance.

    You can ask me about:
    - career roadmap
    - required skills
    - courses
    - resume tips
    - internships and jobs
    """

        return jsonify({"reply": reply.strip()})
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)