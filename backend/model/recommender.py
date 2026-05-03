import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from model.preprocess import clean_text, normalize_list_from_text
from model.career_classifier import CareerCategoryClassifier
from database import get_careers_data


EDUCATION_ORDER = {
    "5th": 0,
    "8th": 1,
    "10th": 2,
    "12th": 3,
    "graduate": 4,
    "postgraduate": 5,
}


DOMAIN_KEYWORDS = {
    "tech": [
        "python", "java", "javascript", "react", "html", "css", "sql", "data",
        "analytics", "machine learning", "ai", "backend", "frontend", "developer",
        "programming", "coding", "api", "flask", "django", "power bi", "excel",
        "statistics", "c++", "c", "system design"
    ],
    "creative": [
        "interior", "fashion", "makeup", "beauty", "mehendi", "art", "craft",
        "photography", "video", "design", "decor", "styling"
    ],
    "business": [
        "business", "sales", "marketing", "reselling", "entrepreneur", "ecommerce",
        "social media", "customer", "management"
    ],
    "education": [
        "teaching", "teacher", "tutor", "children", "education", "school"
    ],
    "healthcare": [
        "health", "nursing", "medical", "pharmacy", "lab", "nutrition", "fitness", "yoga"
    ],
}


def safe_get(row, column, default=""):
    if column in row and pd.notna(row[column]):
        return str(row[column])
    return default


def parse_training_resources(resource_text):
    if not resource_text:
        return []

    resources = []
    items = str(resource_text).split(";")

    for item in items:
        parts = [p.strip() for p in item.split("|")]

        if len(parts) == 4:
            resources.append({
                "title": parts[0],
                "platform": parts[1],
                "level": parts[2],
                "link": parts[3],
            })
        elif len(parts) == 3:
            resources.append({
                "title": parts[0],
                "platform": parts[1],
                "level": parts[2],
                "link": "#",
            })
        else:
            resources.append({
                "title": item.strip(),
                "platform": "General",
                "level": "General",
                "link": "#",
            })

    return resources


def build_learning_roadmap(career_name, missing_skills, matched_skills):
    return [
        {
            "step": 1,
            "title": "Build Foundation",
            "description": "Start with basics and understand core concepts.",
        },
        {
            "step": 2,
            "title": "Learn Missing Skills" if missing_skills else "Strengthen Skills",
            "description": (
                f"Focus on: {', '.join(missing_skills)}"
                if missing_skills
                else "Improve your existing strengths."
            ),
        },
        {
            "step": 3,
            "title": "Practice Projects",
            "description": f"Work on real projects related to {career_name}.",
        },
        {
            "step": 4,
            "title": "Apply & Grow",
            "description": "Build portfolio and apply for jobs, freelance work, or business opportunities.",
        },
    ]


def normalize_education(education_text):
    text = str(education_text).lower().strip()

    if any(x in text for x in ["postgraduate", "masters", "master", "mba", "m.tech", "mtech"]):
        return "postgraduate"
    if any(x in text for x in ["graduate", "b.tech", "btech", "bsc", "bca", "ba", "b.com", "degree"]):
        return "graduate"
    if "12" in text:
        return "12th"
    if "10" in text:
        return "10th"
    if "8" in text:
        return "8th"
    if "5" in text:
        return "5th"

    return "10th"


def detect_domain(text):
    text = str(text).lower()
    domain_scores = {}

    for domain, keywords in DOMAIN_KEYWORDS.items():
        score = sum(1 for keyword in keywords if keyword in text)
        domain_scores[domain] = score

    best_domain = max(domain_scores, key=domain_scores.get)

    if domain_scores[best_domain] == 0:
        return "general"

    return best_domain


def domain_alignment_score(user_domain, career_domain):
    if user_domain == "general" or career_domain == "general":
        return 0.0

    if user_domain == career_domain:
        return 0.25

    weak_matches = {
        ("tech", "business"),
        ("business", "tech"),
        ("creative", "business"),
        ("business", "creative"),
        ("healthcare", "education"),
        ("education", "healthcare"),
    }

    if (user_domain, career_domain) in weak_matches:
        return 0.06

    return -0.25


class HybridCareerRecommender:

    def __init__(self, csv_path="data/careers.csv"):
        

        self.df = get_careers_data(csv_path).fillna("")
        required_columns = [
            "career_name",
            "category",
            "min_education",
            "interests",
            "required_skills",
            "description",
            "training_resource",
            "opportunity_type",
            "work_mode",
            "women_friendly",
            "career_restart",
            "investment_level",
            "safety_level",
        ]

        for col in required_columns:
            if col not in self.df.columns:
                self.df[col] = ""

        self.df["career_name"] = self.df["career_name"].astype(str).str.strip()
        self.df = self.df.drop_duplicates(subset=["career_name"], keep="first")

        self.df["career_domain"] = self.df.apply(
            lambda row: detect_domain(
                f"{safe_get(row, 'career_name')} "
                f"{safe_get(row, 'category')} "
                f"{safe_get(row, 'interests')} "
                f"{safe_get(row, 'required_skills')} "
                f"{safe_get(row, 'description')}"
            ),
            axis=1,
        )

        self.df["combined_text"] = self.df.apply(
            lambda row: clean_text(
                f"{safe_get(row, 'career_name')} "
                f"{safe_get(row, 'category')} "
                f"{safe_get(row, 'interests')} "
                f"{safe_get(row, 'required_skills')} "
                f"{safe_get(row, 'description')} "
                f"{safe_get(row, 'training_resource')} "
                f"{safe_get(row, 'opportunity_type')} "
                f"{safe_get(row, 'work_mode')} "
                f"{safe_get(row, 'women_friendly')} "
                f"{safe_get(row, 'career_restart')} "
                f"{safe_get(row, 'investment_level')} "
                f"{safe_get(row, 'safety_level')}"
            ),
            axis=1,
        )

        self.vectorizer = TfidfVectorizer(
            stop_words="english",
            ngram_range=(1, 2),
            min_df=1
        )

        self.career_vectors = self.vectorizer.fit_transform(self.df["combined_text"])

        try:
            self.category_classifier = CareerCategoryClassifier(csv_path)
        except Exception:
            self.category_classifier = None

    def filter_by_rules(self, user_data):
        user_education = normalize_education(user_data.get("education", "10th"))
        user_edu_level = EDUCATION_ORDER.get(user_education, 2)

        preferred_work_type = str(user_data.get("preferred_work_type", "")).lower()
        preferred_work_mode = str(user_data.get("preferred_work_mode", "")).lower()

        filtered_rows = []

        for _, row in self.df.iterrows():
            career_edu = normalize_education(safe_get(row, "min_education", "5th"))
            career_level = EDUCATION_ORDER.get(career_edu, 1)

            if career_level > user_edu_level:
                continue

            opportunity_type = safe_get(row, "opportunity_type").lower()
            category = safe_get(row, "category").lower()
            work_mode = safe_get(row, "work_mode").lower()

            if preferred_work_type and preferred_work_type != "any":
                if preferred_work_type not in opportunity_type and preferred_work_type not in category:
                    continue

            if preferred_work_mode and preferred_work_mode != "any":
                if preferred_work_mode not in work_mode:
                    continue

            filtered_rows.append(row)

        return pd.DataFrame(filtered_rows) if filtered_rows else self.df.copy()

    def calculate_demographic_score(self, row, user_data):
        score = 0.0

        career_stage = str(user_data.get("career_stage", "")).lower()
        preferred_work_mode = str(user_data.get("preferred_work_mode", "")).lower()
        preferred_work_type = str(user_data.get("preferred_work_type", "")).lower()

        work_mode = safe_get(row, "work_mode").lower()
        opportunity_type = safe_get(row, "opportunity_type").lower()
        women_friendly = safe_get(row, "women_friendly").lower()
        career_restart = safe_get(row, "career_restart").lower()
        investment_level = safe_get(row, "investment_level").lower()
        safety_level = safe_get(row, "safety_level").lower()

        if women_friendly == "yes":
            score += 0.10

        if any(x in career_stage for x in ["restart", "homemaker", "break", "start business"]):
            if career_restart == "yes":
                score += 0.15

        if preferred_work_mode and preferred_work_mode != "any" and preferred_work_mode in work_mode:
            score += 0.10

        if preferred_work_type and preferred_work_type != "any" and preferred_work_type in opportunity_type:
            score += 0.08

        if safety_level == "high":
            score += 0.10
        elif safety_level == "medium":
            score += 0.05

        if investment_level == "low":
            score += 0.08
        elif investment_level == "medium":
            score += 0.04

        return min(score, 0.35)

    def generate_tags(self, row, user_data):
        tags = []

        work_mode = safe_get(row, "work_mode").lower()
        opportunity = safe_get(row, "opportunity_type").lower()
        women_friendly = safe_get(row, "women_friendly").lower()
        career_restart = safe_get(row, "career_restart").lower()
        investment_level = safe_get(row, "investment_level").lower()
        safety_level = safe_get(row, "safety_level").lower()

        if women_friendly == "yes":
            tags.append("👩 Women Friendly")

        if career_restart == "yes":
            tags.append("🔁 Career Restart Friendly")

        if "home" in work_mode:
            tags.append("🏠 Work From Home")

        if "flexible" in work_mode:
            tags.append("⏱ Flexible")

        if investment_level == "low":
            tags.append("💡 Low Investment")

        if safety_level == "high":
            tags.append("🛡 Safe Option")

        if "self" in opportunity or "business" in opportunity or "freelance" in opportunity:
            tags.append("🚀 Independent Work")

        user_education = normalize_education(user_data.get("education", ""))
        if user_education in ["5th", "8th", "10th", "12th"]:
            tags.append("🎓 Beginner Friendly")

        return list(dict.fromkeys(tags))

    def build_explanation(self, row, user_data, matched_skills, missing_skills, user_domain, career_domain):
        career_name = safe_get(row, "career_name")
        interests = user_data.get("interests", "your selected interests")

        explanation = (
            f"{career_name} is recommended because it matches your interests in {interests} "
            f"and belongs to the {career_domain} domain."
        )

        if matched_skills:
            explanation += f" You already have relevant skills like {', '.join(matched_skills[:3])}."

        if missing_skills:
            explanation += f" To improve readiness, learn {', '.join(missing_skills[:3])}."

        if user_domain == career_domain and user_domain != "general":
            explanation += " The career domain also aligns with your profile."

        if safe_get(row, "women_friendly").lower() == "yes":
            explanation += " This option is marked as women-friendly."

        if safe_get(row, "career_restart").lower() == "yes":
            explanation += " It is also suitable for career restart."

        if safe_get(row, "work_mode"):
            explanation += f" It supports {safe_get(row, 'work_mode')} work mode."

        return explanation

    def recommend(self, user_data, top_n=5):
        filtered_df = self.filter_by_rules(user_data).copy()

        user_text_raw = (
            f"{user_data.get('education', '')} "
            f"{user_data.get('interests', '')} "
            f"{user_data.get('skills', '')} "
            f"{user_data.get('career_goal', '')} "
            f"{user_data.get('career_stage', '')} "
            f"{user_data.get('personality_type', '')} "
            f"{user_data.get('preferred_work_type', '')} "
            f"{user_data.get('preferred_work_mode', '')}"
        )

        user_domain = detect_domain(user_text_raw)

        if self.category_classifier:
            try:
                predicted_category = self.category_classifier.predict_category(user_data)
            except Exception:
                predicted_category = "Recommended Careers"
        else:
            predicted_category = "Recommended Careers"

        category_filtered_df = pd.DataFrame()

        if predicted_category and predicted_category != "Recommended Careers":
            category_filtered_df = filtered_df[
                filtered_df["category"].astype(str).str.lower() == predicted_category.lower()
            ]

        # Only use category filter if it still keeps enough options
        if not category_filtered_df.empty and len(category_filtered_df) >= top_n:
            filtered_df = category_filtered_df.copy()

        filtered_df["combined_text"] = filtered_df.apply(
            lambda row: clean_text(
                f"{safe_get(row, 'career_name')} "
                f"{safe_get(row, 'category')} "
                f"{safe_get(row, 'interests')} "
                f"{safe_get(row, 'required_skills')} "
                f"{safe_get(row, 'description')} "
                f"{safe_get(row, 'training_resource')} "
                f"{safe_get(row, 'opportunity_type')} "
                f"{safe_get(row, 'work_mode')} "
                f"{safe_get(row, 'women_friendly')} "
                f"{safe_get(row, 'career_restart')} "
                f"{safe_get(row, 'investment_level')} "
                f"{safe_get(row, 'safety_level')}"
            ),
            axis=1,
        )

        filtered_vectors = self.vectorizer.transform(filtered_df["combined_text"])
        user_text = clean_text(user_text_raw)

        user_vector = self.vectorizer.transform([user_text])
        scores = cosine_similarity(user_vector, filtered_vectors).flatten()

        filtered_df = filtered_df.reset_index(drop=True)

        user_skills = set(normalize_list_from_text(user_data.get("skills", "")))
        user_skills_list = list(user_skills)

        scored_results = []
        seen = set()

        for idx in scores.argsort()[::-1]:
            row = filtered_df.iloc[idx]
            career_name = safe_get(row, "career_name")

            if not career_name or career_name.lower() in seen:
                continue

            seen.add(career_name.lower())

            required_skills = [
                s.strip().lower()
                for s in str(safe_get(row, "required_skills")).split(",")
                if s.strip()
            ]

            matched_skills = [skill for skill in required_skills if skill in user_skills]
            missing_skills = [skill for skill in required_skills if skill not in user_skills]

            readiness = len(matched_skills) / len(required_skills) if required_skills else 0
            tfidf_score = float(scores[idx])
            demographic_score = self.calculate_demographic_score(row, user_data)

            career_domain = safe_get(row, "career_domain", "general")
            domain_score = domain_alignment_score(user_domain, career_domain)

            exact_skill_bonus = 0.0
            if matched_skills:
                exact_skill_bonus = min(len(matched_skills) * 0.08, 0.24)

            final_score = (
                0.40 * tfidf_score +
                0.35 * readiness +
                0.15 * demographic_score +
                0.10 * max(domain_score, 0)
                + exact_skill_bonus
            )

            if domain_score < 0:
                final_score += domain_score

            if user_domain == "tech" and career_domain == "creative" and readiness == 0:
                final_score -= 0.30

            if user_domain == "tech" and any(x in career_name.lower() for x in ["designer", "makeup", "beauty", "interior", "fashion"]):
                final_score -= 0.25

            final_score = max(0, min(final_score, 1))

            if final_score < 0.08:
                continue

            career_query = career_name.replace(" ", "%20")
            naukri_query = career_name.lower().replace(" ", "-")

            job_links = {
                "linkedin": f"https://www.linkedin.com/jobs/search/?keywords={career_query}",
                "naukri": f"https://www.naukri.com/{naukri_query}-jobs",
            }

            scored_results.append({
                "career_name": career_name,
                "category": safe_get(row, "category"),

                "match_score": round(final_score, 2),
                "tfidf_score": round(tfidf_score, 2),
                "demographic_score": round(demographic_score, 2),
                "domain_score": round(domain_score, 2),

                "match_percent": round(final_score * 100),
                "tfidf_percent": round(tfidf_score * 100),
                "demographic_percent": round(demographic_score * 100),

                "description": safe_get(row, "description"),

                "user_entered_skills": user_skills_list,
                "required_skills": required_skills,
                "matched_skills": matched_skills,
                "missing_skills": missing_skills,

                "training_resources": parse_training_resources(
                    safe_get(row, "training_resource")
                ),
                "learning_roadmap": build_learning_roadmap(
                    career_name,
                    missing_skills,
                    matched_skills,
                ),

                "personality_type": user_data.get("personality_type", ""),
                "explanation": self.build_explanation(
                    row,
                    user_data,
                    matched_skills,
                    missing_skills,
                    user_domain,
                    career_domain,
                ),
                "readiness_score": round(readiness * 100),
                "tags": self.generate_tags(row, user_data),

                "opportunity_type": safe_get(row, "opportunity_type"),
                "work_mode": safe_get(row, "work_mode"),

                "women_friendly": safe_get(row, "women_friendly"),
                "career_restart": safe_get(row, "career_restart"),
                "investment_level": safe_get(row, "investment_level"),
                "safety_level": safe_get(row, "safety_level"),
                "career_domain": career_domain,
                "user_domain": user_domain,

                "job_links": job_links,
            })

        scored_results = sorted(
            scored_results,
            key=lambda x: x["match_score"],
            reverse=True,
        )

        return {
            "predicted_category": predicted_category,
            "recommended_careers": scored_results[:top_n],
        }