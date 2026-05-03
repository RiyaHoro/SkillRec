import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from model.preprocess import clean_text, normalize_list_from_text
from model.career_classifier import CareerCategoryClassifier


EDUCATION_ORDER = {
    "5th": 0,
    "8th": 1,
    "10th": 2,
    "12th": 3,
    "graduate": 4,
    "postgraduate": 5,
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
    roadmap = []

    roadmap.append({
        "step": 1,
        "title": "Build Foundation",
        "description": "Start with basics and understand core concepts.",
    })

    if missing_skills:
        roadmap.append({
            "step": 2,
            "title": "Learn Missing Skills",
            "description": f"Focus on: {', '.join(missing_skills)}",
        })
    else:
        roadmap.append({
            "step": 2,
            "title": "Strengthen Skills",
            "description": "Improve your existing strengths.",
        })

    roadmap.append({
        "step": 3,
        "title": "Practice Projects",
        "description": f"Work on real projects related to {career_name}.",
    })

    roadmap.append({
        "step": 4,
        "title": "Apply & Grow",
        "description": "Build portfolio and apply for jobs, freelance work, or business opportunities.",
    })

    return roadmap


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


class HybridCareerRecommender:

    def __init__(self, csv_path="data/careers.csv"):
        self.df = pd.read_csv(csv_path, on_bad_lines="skip").fillna("")

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

        self.vectorizer = TfidfVectorizer(stop_words="english")
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

        if not filtered_rows:
            return self.df.copy()

        return pd.DataFrame(filtered_rows)

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

    def build_explanation(self, row, user_data, matched_skills, missing_skills):
        career_name = safe_get(row, "career_name")
        interests = user_data.get("interests", "your selected interests")

        explanation = (
            f"{career_name} is recommended because it matches your interests in {interests} "
            f"and your current profile."
        )

        if matched_skills:
            explanation += f" You already have useful skills like {', '.join(matched_skills[:3])}."

        if missing_skills:
            explanation += f" To improve readiness, learn {', '.join(missing_skills[:3])}."

        if safe_get(row, "women_friendly").lower() == "yes":
            explanation += " This option is marked as women-friendly."

        if safe_get(row, "career_restart").lower() == "yes":
            explanation += " It is also suitable for career restart."

        if safe_get(row, "work_mode"):
            explanation += f" It supports {safe_get(row, 'work_mode')} work mode."

        return explanation

    def recommend(self, user_data, top_n=5):
        filtered_df = self.filter_by_rules(user_data).copy()

        if self.category_classifier:
            try:
                predicted_category = self.category_classifier.predict_category(user_data)
            except Exception:
                predicted_category = "Recommended Careers"
        else:
            predicted_category = "Recommended Careers"

        if predicted_category and predicted_category != "Recommended Careers":
            category_filtered_df = filtered_df[
                filtered_df["category"].astype(str).str.lower() == predicted_category.lower()
            ]

            if not category_filtered_df.empty:
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

        user_text = clean_text(
            f"{user_data.get('education', '')} "
            f"{user_data.get('interests', '')} "
            f"{user_data.get('skills', '')} "
            f"{user_data.get('career_goal', '')} "
            f"{user_data.get('career_stage', '')} "
            f"{user_data.get('personality_type', '')} "
            f"{user_data.get('preferred_work_type', '')} "
            f"{user_data.get('preferred_work_mode', '')}"
        )

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

            matched_skills = [
                skill for skill in required_skills
                if skill in user_skills
            ]

            missing_skills = [
                skill for skill in required_skills
                if skill not in user_skills
            ]

            readiness = len(matched_skills) / len(required_skills) if required_skills else 0
            tfidf_score = float(scores[idx])
            demographic_score = self.calculate_demographic_score(row, user_data)

            final_score = (
                0.55 * tfidf_score +
                0.30 * readiness +
                0.15 * demographic_score
            )

            final_score = max(0, min(final_score, 1))

            if final_score < 0.04:
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

                # IMPORTANT:
                # Keep these as decimals because your frontend already multiplies by 100.
                "match_score": round(final_score, 2),
                "tfidf_score": round(tfidf_score, 2),
                "demographic_score": round(demographic_score, 2),

                # Optional percentage values if you need them later.
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
                ),
                "readiness_score": round(readiness * 100),
                "tags": self.generate_tags(row, user_data),

                "opportunity_type": safe_get(row, "opportunity_type"),
                "work_mode": safe_get(row, "work_mode"),

                "women_friendly": safe_get(row, "women_friendly"),
                "career_restart": safe_get(row, "career_restart"),
                "investment_level": safe_get(row, "investment_level"),
                "safety_level": safe_get(row, "safety_level"),

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