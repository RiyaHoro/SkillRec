import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from model.preprocess import clean_text, normalize_list_from_text

EDUCATION_ORDER = {
    "8th": 1,
    "10th": 2,
    "12th": 3,
    "graduate": 4,
    "postgraduate": 5
}
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
                "link": parts[3]
            })
        elif len(parts) == 3:
            resources.append({
                "title": parts[0],
                "platform": parts[1],
                "level": parts[2],
                "link": "#"
            })
        else:
            resources.append({
                "title": item.strip(),
                "platform": "General",
                "level": "General",
                "link": "#"
            })

    return resources


def build_learning_roadmap(career_name, missing_skills, matched_skills):
    roadmap = []

    roadmap.append({
        "step": 1,
        "title": "Build Foundation",
        "description": "Start with the basics of the recommended career and understand the core concepts."
    })

    if missing_skills:
        roadmap.append({
            "step": 2,
            "title": "Learn Missing Skills",
            "description": f"Focus on these missing skills first: {', '.join(missing_skills)}."
        })
    else:
        roadmap.append({
            "step": 2,
            "title": "Strengthen Existing Skills",
            "description": "You already match many required skills. Improve speed, confidence, and real application."
        })

    roadmap.append({
        "step": 3,
        "title": "Practice with Small Projects",
        "description": f"Apply your learning through small practical tasks related to {career_name}."
    })

    roadmap.append({
        "step": 4,
        "title": "Prepare for Opportunities",
        "description": "Create a portfolio, sample work, or service profile and start applying or offering services."
    })

    return roadmap
def normalize_education(education_text):
    text = education_text.lower().strip()

    if "postgraduate" in text or "masters" in text or "m.tech" in text or "mba" in text:
        return "postgraduate"
    if "graduate" in text or "b.tech" in text or "bsc" in text or "bca" in text or "ba" in text:
        return "graduate"
    if "12" in text:
        return "12th"
    if "10" in text:
        return "10th"
    if "8" in text:
        return "8th"

    return "10th"

class HybridCareerRecommender:
    def __init__(self, csv_path="data/careers.csv"):
        self.df = pd.read_csv(csv_path).fillna("")

        self.df["combined_text"] = self.df.apply(
            lambda row: clean_text(
                f"{row['career_name']} "
                f"{row['category']} "
                f"{row['interests']} "
                f"{row['required_skills']} "
                f"{row['description']} "
                f"{row['training_resource']} "
                f"{row['opportunity_type']} "
                f"{row['work_mode']}"
            ),
            axis=1
        )

        self.vectorizer = TfidfVectorizer(stop_words="english")
        self.career_vectors = self.vectorizer.fit_transform(self.df["combined_text"])

    def filter_by_rules(self, user_data):
        user_education = normalize_education(user_data.get("education", "10th"))
        user_edu_level = EDUCATION_ORDER.get(user_education, 2)

        preferred_work_type = user_data.get("preferred_work_type", "").lower().strip()
        preferred_work_mode = user_data.get("preferred_work_mode", "").lower().strip()

        filtered_rows = []

        for _, row in self.df.iterrows():
            career_education = str(row["min_education"]).lower().strip()
            career_edu_level = EDUCATION_ORDER.get(career_education, 1)

            if career_edu_level > user_edu_level:
                continue

            if preferred_work_type and preferred_work_type != "any":
                if preferred_work_type not in str(row["opportunity_type"]).lower() and preferred_work_type not in str(row["category"]).lower():
                    continue

            if preferred_work_mode and preferred_work_mode != "any":
                if preferred_work_mode not in str(row["work_mode"]).lower():
                    continue

            filtered_rows.append(row)

        if not filtered_rows:
            return self.df.copy()

        return pd.DataFrame(filtered_rows)

    def recommend(self, user_data, top_n=5):
        filtered_df = self.filter_by_rules(user_data)

        filtered_df = filtered_df.copy()
        filtered_df["combined_text"] = filtered_df.apply(
            lambda row: clean_text(
                f"{row['career_name']} "
                f"{row['category']} "
                f"{row['interests']} "
                f"{row['required_skills']} "
                f"{row['description']} "
                f"{row['training_resource']} "
                f"{row['opportunity_type']} "
                f"{row['work_mode']}"
            ),
            axis=1
        )

        filtered_vectors = self.vectorizer.transform(filtered_df["combined_text"])

        user_text = clean_text(
            f"{user_data.get('education', '')} "
            f"{user_data.get('interests', '')} "
            f"{user_data.get('skills', '')} "
            f"{user_data.get('career_goal', '')} "
            f"{user_data.get('preferred_work_type', '')} "
            f"{user_data.get('preferred_work_mode', '')}"
        )

        user_vector = self.vectorizer.transform([user_text])
        scores = cosine_similarity(user_vector, filtered_vectors).flatten()

        filtered_df = filtered_df.reset_index(drop=True)
        top_indices = scores.argsort()[::-1][:top_n]

        user_skills = set(normalize_list_from_text(user_data.get("skills", "")))

        results = []

        for idx in top_indices:
            row = filtered_df.iloc[idx]

            required_skills = [s.strip() for s in str(row["required_skills"]).split(",") if s.strip()]
            missing_skills = [skill for skill in required_skills if skill.lower() not in user_skills]
            matched_skills = [skill for skill in required_skills if skill.lower() in user_skills]

            results.append({
                "career_name": row["career_name"],
                "category": row["category"],
                "match_score": round(float(scores[idx]), 2),
                "description": row["description"],
                "required_skills": required_skills,
                "matched_skills": matched_skills,
                "missing_skills": missing_skills,
                "training_resource": row["training_resource"],
                "training_resources": parse_training_resources(row["training_resource"]),
                "learning_roadmap": build_learning_roadmap(
                    row["career_name"],
                    missing_skills,
                    matched_skills
                ),
                "opportunity_type": row["opportunity_type"],
                "work_mode": row["work_mode"]
    })

# ✅ RETURN OUTSIDE LOOP
        return results