# 🚀 SkillSakhi – AI-Powered Career Recommendation System

![React](https://img.shields.io/badge/Frontend-React-blue)
![Flask](https://img.shields.io/badge/Backend-Flask-green)
![Tailwind](https://img.shields.io/badge/Styling-TailwindCSS-38bdf8)
![Status](https://img.shields.io/badge/Status-Active-success)

SkillSakhi is an intelligent web application that provides **personalized career recommendations** based on a user's skills, interests, education, and goals.  

It helps users:
- discover suitable career paths  
- analyze skill gaps  
- get actionable learning recommendations  

---

## 🌟 Features

- 🎯 Personalized career recommendations  
- 📊 Skill gap analysis (required vs missing skills)  
- 📈 Match score for each career path  
- 🧠 AI/ML-based recommendation engine (TF-IDF)  
- 💼 Work type & work mode suggestions  
- 📚 Suggested training resources  
- 🎨 Modern UI with Tailwind CSS + animations  

---

## 🖥️ Tech Stack

### 🔹 Frontend
- React (Vite)
- Tailwind CSS
- React Router
- Recharts

### 🔹 Backend
- Flask (Python)
- Scikit-learn (TF-IDF)
- Flask-CORS


---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/skillsakhi.git
cd skillsakhi
2️⃣ Frontend Setup
cd frontend
npm install
npm run dev

Frontend runs at:
👉 http://localhost:5173

3️⃣ Backend Setup
cd backend
pip install -r requirements.txt
python app.py

Backend runs at:
👉 http://localhost:5000

🔗 API Endpoint
POST /recommend
📥 Sample Request
{
  "age": 22,
  "education": "Graduate",
  "interests": "coding, analytics",
  "skills": "python, sql",
  "career_goal": "Data Analyst",
  "preferred_work_type": "job",
  "preferred_work_mode": "office"
}
```
## Output
    Recommended career paths
    Match score (%)
    Required skills
    Missing skills
    Matched skills
    Suggested training resources
## Deployment
    Frontend → Vercel / Netlify
    Backend → Render
## Author

    Riya Horo
    🔗 GitHub: https://github.com/RiyaHoro
## Future Improvements
    🔐 Authentication system
    📄 Resume upload & analysis
    🤖 AI chatbot for guidance
    📊 Analytics dashboard
    🎯 Improved ML model
    📜 License

This project is licensed under the MIT License.

 

---

