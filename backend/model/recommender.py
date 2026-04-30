import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from model.preprocess import clean_text, normalize_list_from_text
from model.career_classifier import CareerCategoryClassifier

# Education hierarchy
EDUCATION_ORDER = {
    "8th": 1,
    "10th": 2,
    "12th": 3,
    "graduate": 4,
    "postgraduate": 5
}


# -----------------------------
# Parse course data
# -----------------------------
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


# -----------------------------
# Build roadmap
# -----------------------------
def build_learning_roadmap(career_name, missing_skills, matched_skills):
    roadmap = []

    roadmap.append({
        "step": 1,
        "title": "Build Foundation",
        "description": "Start with basics and understand core concepts."
    })

    if missing_skills:
        roadmap.append({
            "step": 2,
            "title": "Learn Missing Skills",
            "description": f"Focus on: {', '.join(missing_skills)}"
        })
    else:
        roadmap.append({
            "step": 2,
            "title": "Strengthen Skills",
            "description": "Improve your existing strengths."
        })

    roadmap.append({
        "step": 3,
        "title": "Practice Projects",
        "description": f"Work on real projects related to {career_name}."
    })

    roadmap.append({
        "step": 4,
        "title": "Apply & Grow",
        "description": "Build portfolio and apply for jobs or start work."
    })

    return roadmap


# -----------------------------
# Normalize education
# -----------------------------
def normalize_education(education_text):
    text = education_text.lower().strip()

    if any(x in text for x in ["postgraduate", "masters", "mba", "m.tech"]):
        return "postgraduate"
    if any(x in text for x in ["graduate", "b.tech", "bsc", "bca", "ba"]):
        return "graduate"
    if "12" in text:
        return "12th"
    if "10" in text:
        return "10th"
    if "8" in text:
        return "8th"

    return "10th"


# =============================
# MAIN CLASS
# =============================
class HybridCareerRecommender:

    def __init__(self, csv_path="data/careers.csv"):
        self.df = pd.read_csv(csv_path).fillna("")
       

        # Combine text for ML
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
        self.category_classifier = CareerCategoryClassifier(csv_path)


    # -----------------------------
    # Rule-based filtering
    # -----------------------------
    def filter_by_rules(self, user_data):

        user_education = normalize_education(user_data.get("education", "10th"))
        user_edu_level = EDUCATION_ORDER.get(user_education, 2)

        preferred_work_type = user_data.get("preferred_work_type", "").lower()
        preferred_work_mode = user_data.get("preferred_work_mode", "").lower()

        filtered_rows = []

        for _, row in self.df.iterrows():
            career_edu = str(row["min_education"]).lower()
            career_level = EDUCATION_ORDER.get(career_edu, 1)

            # education filter
            if career_level > user_edu_level:
                continue

            # work type filter
            if preferred_work_type and preferred_work_type != "any":
                if preferred_work_type not in str(row["opportunity_type"]).lower() \
                        and preferred_work_type not in str(row["category"]).lower():
                    continue

            # work mode filter
            if preferred_work_mode and preferred_work_mode != "any":
                if preferred_work_mode not in str(row["work_mode"]).lower():
                    continue

            filtered_rows.append(row)

        if not filtered_rows:
            return self.df.copy()

        return pd.DataFrame(filtered_rows)


    # -----------------------------
    # MAIN RECOMMEND FUNCTION
    # -----------------------------
    def recommend(self, user_data, top_n=5):
            filtered_df = self.filter_by_rules(user_data).copy()

            predicted_category = self.category_classifier.predict_category(user_data)

            category_filtered_df = filtered_df[
                filtered_df["category"].str.lower() == predicted_category.lower()
            ]

            if not category_filtered_df.empty:
                filtered_df = category_filtered_df.copy()

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
                career_name = row["career_name"]

                if career_name in seen:
                    continue

                seen.add(career_name)

                required_skills = [
                    s.strip().lower()
                    for s in str(row["required_skills"]).split(",")
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

                readiness = (
                    len(matched_skills) / len(required_skills)
                    if required_skills
                    else 0
                )

                tfidf_score = float(scores[idx])

                # Skip very weak matches
                if tfidf_score < 0.05 and readiness == 0:
                    continue

                # Final score combines text similarity + actual skill match
                final_score = (0.6 * tfidf_score) + (0.4 * readiness)

                if final_score < 0.08:
                    continue

                work_mode = str(row["work_mode"]).lower()
                opportunity = str(row["opportunity_type"]).lower()

                tags = []

                if "home" in work_mode:
                    tags.append("🏠 Work From Home")

                if "flexible" in work_mode:
                    tags.append("⏱ Flexible")

                if "self" in opportunity or "business" in opportunity:
                    tags.append("💡 Low Investment Business")

                if user_data.get("career_stage", "").lower() in [
                    "career restart",
                    "homemaker",
                    "want to start business",
                ]:
                    tags.append("👩‍💼 Career Restart Friendly")

                if user_data.get("education", "").lower() in ["8th", "10th", "12th"]:
                    tags.append("🎓 Beginner Friendly")

                if user_data.get("personality_type"):
                    explanation = (
                        f"This career is recommended because it matches your interests in "
                        f"{user_data.get('interests', 'selected areas')}, your skills, "
                        f"and your {user_data.get('personality_type')} personality type."
                    )
                else:
                    explanation = (
                        f"This career is recommended because it matches your interests in "
                        f"{user_data.get('interests', 'selected areas')} and your current skills."
                    )

                career_query = career_name.replace(" ", "%20")
                naukri_query = career_name.lower().replace(" ", "-")

                job_links = {
                    "linkedin": f"https://www.linkedin.com/jobs/search/?keywords={career_query}",
                    "naukri": f"https://www.naukri.com/{naukri_query}-jobs",
                }

                scored_results.append({
                    "career_name": career_name,
                    "category": row["category"],
                    "match_score": round(final_score, 2),
                    "tfidf_score": round(tfidf_score, 2),
                    "description": row["description"],

                    "user_entered_skills": user_skills_list,
                    "required_skills": required_skills,
                    "matched_skills": matched_skills,
                    "missing_skills": missing_skills,

                    "training_resources": parse_training_resources(row["training_resource"]),
                    "learning_roadmap": build_learning_roadmap(
                        career_name,
                        missing_skills,
                        matched_skills,
                    ),

                    "personality_type": user_data.get("personality_type", ""),
                    "explanation": explanation,
                    "readiness_score": round(readiness * 100),
                    "tags": tags,

                    "opportunity_type": row["opportunity_type"],
                    "work_mode": row["work_mode"],
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
            